import { Request, Response } from "express";
import { prisma } from "../prisma/client";
import { verifyPassword } from "../utils/password";
import { signJwt } from "../utils/jwt";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import {
  sendStaffLoginOtpMail,
  sendStaffPasswordResetOtpMail,
} from "../utils/mailer";

const OTP_EXPIRY_MINUTES = 10;

export async function staffLogin(req: Request, res: Response) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const staff = await prisma.staff.findUnique({
      where: { email },
    });

    if (!staff) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    const isPasswordValid = await verifyPassword(password, staff.passwordHash);

    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    // Invalidate previous OTPs
    await prisma.otpVerification.updateMany({
      where: {
        staffId: staff.id,
        isUsed: false,
        expiresAt: { gt: new Date() },
      },
      data: { isUsed: true },
    });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpHash = await bcrypt.hash(otp, 10);

    await prisma.otpVerification.create({
      data: {
        staffId: staff.id,
        otpHash,
        expiresAt: new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000),
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

    await sendStaffLoginOtpMail(
      staff.email,
      otp,
      staff.fullName,
      ip,
      device,
      time,
    );

    return res.json({
      message: "OTP sent to registered email",
    });
  } catch (error) {
    console.error("Staff login error:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

export async function verifyStaffOtp(req: Request, res: Response) {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: "Invalid request" });
    }

    const staff = await prisma.staff.findUnique({
      where: { email },
    });

    if (!staff) {
      return res.status(400).json({ message: "Invalid OTP or expired OTP" });
    }

    const otpEntry = await prisma.otpVerification.findFirst({
      where: {
        staffId: staff.id,
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

    await prisma.otpVerification.update({
      where: { id: otpEntry.id },
      data: { isUsed: true },
    });

    const token = jwt.sign(
      {
        sub: staff.id,
         id: staff.id,
        role: staff.role,
        email: staff.email,
        name: staff.fullName,
        staffId: staff.id,
      },
      process.env.JWT_SECRET!,
      { expiresIn: "1d" },
    );

    return res.json({ token });
  } catch (error) {
    console.error("Verify staff OTP error:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

export const requestStaffPasswordReset = async (
  req: Request,
  res: Response,
) => {
  const { email } = req.body;

  if (!email) {
    return res.status(200).json({
      message:
        "If the email exists, an OTP has been sent to the registered address.",
    });
  }

  const staff = await prisma.staff.findUnique({
    where: { email },
  });

  if (!staff) {
    return res.status(200).json({
      message:
        "If the email exists, an OTP has been sent to the registered address.",
    });
  }

  await prisma.otpVerification.updateMany({
    where: {
      staffId: staff.id,
      isUsed: false,
      expiresAt: { gt: new Date() },
    },
    data: { isUsed: true },
  });

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const otpHash = await bcrypt.hash(otp, 10);

  await prisma.otpVerification.create({
    data: {
      staffId: staff.id,
      otpHash,
      expiresAt: new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000),
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

  await sendStaffPasswordResetOtpMail(
    staff.email,
    otp,
    staff.fullName,
    ip,
    device,
    time,
  );

  return res.status(200).json({
    message:
      "If the email exists, an OTP has been sent to the registered address.",
  });
};

export const resetStaffPassword = async (req: Request, res: Response) => {
  const { email, otp, newPassword } = req.body;

  if (!email || !otp || !newPassword) {
    return res.status(400).json({ message: "Invalid request" });
  }

  const staff = await prisma.staff.findUnique({
    where: { email },
  });

  if (!staff) {
    return res.status(400).json({ message: "Invalid OTP or expired OTP" });
  }

  const otpEntry = await prisma.otpVerification.findFirst({
    where: {
      staffId: staff.id,
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
    prisma.staff.update({
      where: { id: staff.id },
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
