import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../prisma";
import { generateOtp, hashOtp, verifyOtpHash } from "../utils/otp";
import { sendOtpMail } from "../utils/mailer";

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

if (student.isDeleted) {
  return res.status(403).json({
    message: "Your account has been removed from the system.",
  });
}

if (!student.active) {
  return res.status(403).json({
    message: "Your account has been deactivated. Please contact administration.",
  });
}

  const ok = await bcrypt.compare(password, student.passwordHash);
  if (!ok) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const otp = generateOtp();
  const otpHash = await hashOtp(otp);
  const expiresAt = new Date(Date.now() + OTP_EXP_MIN * 60 * 1000);
  const ip = req.ip || "Unknown IP";
  const device = req.headers["user-agent"] || "Unknown Device";
  const time = new Date().toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
  await prisma.otpVerification.create({
    data: {
      studentId: student.id,
      otpHash,
      expiresAt,
    },
  });

  await sendOtpMail(student.email, otp, student.fullName, ip, device, time);

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

if (student.isDeleted) {
  return res.status(403).json({
    message: "Your account has been removed from the system.",
  });
}

if (!student.active) {
  return res.status(403).json({
    message: "Your account has been deactivated. Please contact administration.",
  });
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

  const token = jwt.sign(
    {
      sub: student.id,
      id: student.id,
      role: "STUDENT",
      email: student.email,
      name: student.fullName,
    },
    process.env.JWT_SECRET!,
    { expiresIn: "1d" },
  );

  return res.json({ token });
};
