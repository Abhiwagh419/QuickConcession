
import { prisma } from "../prisma";
import { Request, Response } from "express";
export const applyConcession = async (req: Request, res: Response)=> {
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
    },
  });

  return res.status(201).json(application);
};
