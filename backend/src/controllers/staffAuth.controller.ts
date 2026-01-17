import { Request, Response } from "express";
import { prisma } from "../prisma/client";
import { verifyPassword } from "../utils/password";
import { signJwt } from "../utils/jwt";
import jwt from "jsonwebtoken";

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

    const isPasswordValid = await verifyPassword(
      password,
      staff.passwordHash
    );

    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

  const token = jwt.sign(
  {
    sub: staff.id,
    role: "STAFF",
    email: staff.email,
    name: staff.fullName,
    staffId: staff.id,
  },
  process.env.JWT_SECRET!,
  { expiresIn: "1d" }
);


    return res.json({ token });
  } catch (error) {
    console.error("Staff login error:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
}
