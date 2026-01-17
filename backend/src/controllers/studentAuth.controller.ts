import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { prisma } from "../prisma/client";
import { sendPasswordResetOtpMail } from "../utils/mailer";

const OTP_EXPIRY_MINUTES = 10;

/**
 * POST /auth/student/forgot-password
 */
export const requestStudentPasswordReset = async (
  req: Request,
  res: Response
) => {
  const { enrollmentNo } = req.body;

  if (!enrollmentNo) {
    return res.status(200).json({
      message:
        "If the enrollment number exists, an OTP has been sent to the registered email.",
    });
  }

  const student = await prisma.student.findUnique({
    where: { enrollmentNo },
  });

  // IMPORTANT: Do not reveal existence
  if (!student) {
    return res.status(200).json({
      message:
        "If the enrollment number exists, an OTP has been sent to the registered email.",
    });
  }

  // Invalidate previous unused OTPs
  await prisma.otpVerification.updateMany({
    where: {
      studentId: student.id,
      isUsed: false,
      expiresAt: { gt: new Date() },
    },
    data: { isUsed: true },
  });

  // Generate OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const otpHash = await bcrypt.hash(otp, 10);

  const expiresAt = new Date(
    Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000
  );

  await prisma.otpVerification.create({
    data: {
      studentId: student.id,
      otpHash,
      expiresAt,
    },
  });

  // Send email (professional template)
  await sendPasswordResetOtpMail(
  student.email,
  otp,
  student.fullName
);


  return res.status(200).json({
    message:
      "If the enrollment number exists, an OTP has been sent to the registered email.",
  });
};

/**
 * POST /auth/student/reset-password
 */
export const resetStudentPassword = async (
  req: Request,
  res: Response
) => {
  const { enrollmentNo, otp, newPassword } = req.body;

  if (!enrollmentNo || !otp || !newPassword) {
    return res.status(400).json({ message: "Invalid request" });
  }

  const student = await prisma.student.findUnique({
    where: { enrollmentNo },
  });

  if (!student) {
    return res.status(400).json({ message: "Invalid OTP or expired OTP" });
  }

  const otpEntry = await prisma.otpVerification.findFirst({
    where: {
      studentId: student.id,
      isUsed: false,
      expiresAt: { gt: new Date() },
    },
    orderBy: { createdAt: "desc" },
  });

  if (!otpEntry) {
    return res.status(400).json({ message: "Invalid OTP or expired OTP" });
  }

  const isValidOtp = await bcrypt.compare(otp, otpEntry.otpHash);

  if (!isValidOtp) {
    return res.status(400).json({ message: "Invalid OTP or expired OTP" });
  }

  // Hash new password
  const passwordHash = await bcrypt.hash(newPassword, 12);

  await prisma.$transaction([
    prisma.student.update({
      where: { id: student.id },
      data: { passwordHash },
    }),
    prisma.otpVerification.update({
      where: { id: otpEntry.id },
      data: { isUsed: true },
    }),
  ]);

  return res.status(200).json({
    message: "Password reset successful",
  });
};
