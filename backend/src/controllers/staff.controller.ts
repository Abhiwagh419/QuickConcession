import { Request, Response } from "express";
import { prisma } from "../prisma/client";

export async function getStaffMe(req: Request, res: Response) {
  try {
    const staffId = req.user!.sub; // from JWT

    const staff = await prisma.staff.findUnique({
      where: { id: staffId },
      select: {
        id: true,
        fullName: true,
        email: true,
        role: true,
      },
    });

    if (!staff) {
      return res.status(404).json({ message: "Staff not found" });
    }

    return res.json(staff);
  } catch (err) {
    console.error("Get staff me error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
}
