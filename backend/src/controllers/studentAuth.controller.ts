import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { prisma } from "../prisma/client";
import { sendPasswordResetOtpMail } from "../utils/mailer";
import { time } from "console";

const OTP_EXPIRY_MINUTES = 10;

export const requestStudentPasswordReset = async (
  req: Request,
  res: Response,
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

  if (!student) {
    return res.status(200).json({
      message:
        "If the enrollment number exists, an OTP has been sent to the registered email.",
    });
  }

  await prisma.otpVerification.updateMany({
    where: {
      studentId: student.id,
      isUsed: false,
      expiresAt: { gt: new Date() },
    },
    data: { isUsed: true },
  });

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const otpHash = await bcrypt.hash(otp, 10);

  const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

  await prisma.otpVerification.create({
    data: {
      studentId: student.id,
      otpHash,
      expiresAt,
    },
  });

  const ip = req.ip || "Unknown IP";

const device =
  typeof req.headers["user-agent"] === "string"
    ? req.headers["user-agent"]
    : "Unknown Device";

const time = new Date().toLocaleString("en-IN", {
  dateStyle: "medium",
  timeStyle: "short",
});

  await sendPasswordResetOtpMail(student.email, otp, student.fullName, ip, device, time,);

  return res.status(200).json({
    message:
      "If the enrollment number exists, an OTP has been sent to the registered email.",
  });
};

export const resetStudentPassword = async (req: Request, res: Response) => {
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
