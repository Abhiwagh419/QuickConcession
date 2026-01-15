import { prisma } from "../prisma";
import { Request, Response } from "express";

const getExpiryDate = (start: Date, duration: string) => {
  const d = new Date(start);
  if (duration === "Quarterly") d.setMonth(d.getMonth() + 3);
  if (duration === "Half-Yearly") d.setMonth(d.getMonth() + 6);
  if (duration === "Yearly") d.setFullYear(d.getFullYear() + 1);
  return d;
};

export const applyConcession = async (
  req: Request,
  res: Response
) => {
  const studentId = req.user.id;

  const {
    fromLine,
    toLine,
    fromStation,
    toStation,
    travelClass,
    duration,
    startDate,
  } = req.body;

  if (
    !fromLine ||
    !toLine ||
    !fromStation ||
    !toStation ||
    !travelClass ||
    !duration ||
    !startDate
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
      const expiry = getExpiryDate(existing.startDate, existing.duration);

      if (expiry > new Date()) {
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
      startDate: new Date(startDate),
      status: "PENDING",
    },
  });

  return res.status(201).json(application);
};
