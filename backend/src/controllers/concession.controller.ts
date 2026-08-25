import { prisma } from "../prisma";
import { Request, Response } from "express";

export const applyConcession = async (req: Request, res: Response) => {
  const studentId = req.user!.sub;

  const { fromLine, toLine, fromStation, toStation, travelClass, duration } =
    req.body;

  if (
    !fromLine ||
    !toLine ||
    !fromStation ||
    !toStation ||
    !travelClass ||
    !duration
  ) {
    return res.status(400).json({ message: "Missing fields" });
  }

  const existing = await prisma.concessionApplication.findFirst({
    where: {
      studentId,
      status: { in: ["PENDING", "APPROVED"] },
    },
    orderBy: { appliedAt: "desc" },
  });

  if (existing) {
    if (existing.status === "PENDING") {
      return res.status(400).json({
        message: "You already have a pending application",
      });
    }

    if (existing.status === "APPROVED") {
      if (existing.expiryDate && existing.expiryDate > new Date()) {
        return res.status(400).json({
          message: "Your current concession has not expired yet",
        });
      }
    }
  }

  const application = await prisma.concessionApplication.create({
    data: {
      studentId,
      fromLine,
      toLine,
      fromStation,
      toStation,
      travelClass,
      duration,
      status: "PENDING",
    },
  });

  return res.status(201).json(application);
};
