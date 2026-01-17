import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../prisma";
import { generateOtp, hashOtp, verifyOtpHash } from "../utils/otp";
import { sendOtpMail } from "../utils/mailer";
import { signJwt } from "../utils/jwt";

const OTP_EXP_MIN = Number(process.env.OTP_EXPIRY_MINUTES || 5);

export const login = async (req: Request, res: Response) => {
  const { enrollmentNo, password } = req.body;

  if (!enrollmentNo || !password) {
    return res.status(400).json({ message: "Missing credentials" });
  }

  const student = await prisma.student.findUnique({
    where: { enrollmentNo },
  });

  if (!student) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const ok = await bcrypt.compare(password, student.passwordHash);
  if (!ok) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const otp = generateOtp();
  const otpHash = await hashOtp(otp);
  const expiresAt = new Date(Date.now() + OTP_EXP_MIN * 60 * 1000);

  await prisma.otpVerification.create({
    data: {
      studentId: student.id,
      otpHash,
      expiresAt,
    },
  });

  await sendOtpMail(student.email, otp, student.fullName);

  return res.json({ message: "OTP sent to registered email" });
};

export const verifyOtp = async (req: Request, res: Response) => {
  const { enrollmentNo, otp } = req.body;

  if (!enrollmentNo || !otp) {
    return res.status(400).json({ message: "Missing OTP data" });
  }

  const student = await prisma.student.findUnique({
    where: { enrollmentNo },
  });

  if (!student) {
    return res.status(401).json({ message: "Invalid request" });
  }

  const record = await prisma.otpVerification.findFirst({
    where: {
      studentId: student.id,
      isUsed: false,
      expiresAt: { gt: new Date() },
    },
    orderBy: { createdAt: "desc" },
  });

  if (!record) {
    return res.status(401).json({ message: "OTP expired or invalid" });
  }

  const ok = await verifyOtpHash(otp, record.otpHash);
  if (!ok) {
    return res.status(401).json({ message: "Invalid OTP" });
  }

  await prisma.otpVerification.update({
    where: { id: record.id },
    data: { isUsed: true },
  });

const token = signJwt({
  sub: student.id,
  role: "STUDENT",
});


  return res.json({ token });
};
