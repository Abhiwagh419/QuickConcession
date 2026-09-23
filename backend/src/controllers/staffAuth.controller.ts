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

    if (staff.isDeleted) {
      return res.status(403).json({
        message: "Your account has been removed from the system.",
      });
    }

    if (!staff.active) {
      return res.status(403).json({
        message:
          "Your account has been deactivated. Please contact administration.",
      });
    }

    const isPasswordValid = await verifyPassword(password, staff.passwordHash);

    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    await prisma.otpVerification.updateMany({
      where: {
        staffId: staff.id,
        purpose: "LOGIN",
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
        purpose: "LOGIN",
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

    // Re-checked here (not just at the password step) so an account that gets
    // deactivated/soft-deleted between "send OTP" and "verify OTP" can't still
    // complete a login already in progress.
    if (staff.isDeleted) {
      return res.status(403).json({
        message: "Your account has been removed from the system.",
      });
    }

    if (!staff.active) {
      return res.status(403).json({
        message:
          "Your account has been deactivated. Please contact administration.",
      });
    }

    const otpEntry = await prisma.otpVerification.findFirst({
      where: {
        staffId: staff.id,
        purpose: "LOGIN",
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

  // Same generic response either way — otherwise a caller could tell a
  // deactivated/removed account apart from one that simply doesn't exist.
  // We just quietly don't issue a working OTP for it.
  if (staff.isDeleted || !staff.active) {
    return res.status(200).json({
      message:
        "If the email exists, an OTP has been sent to the registered address.",
    });
  }

  await prisma.otpVerification.updateMany({
    where: {
      staffId: staff.id,
      purpose: "RESET",
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
      purpose: "RESET",
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

  // Re-checked here too (not just at the request step) in case the account
  // was deactivated/soft-deleted after a valid OTP was already issued.
  if (staff.isDeleted || !staff.active) {
    return res.status(400).json({ message: "Invalid OTP or expired OTP" });
  }

  const otpEntry = await prisma.otpVerification.findFirst({
    where: {
      staffId: staff.id,
      purpose: "RESET",
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
