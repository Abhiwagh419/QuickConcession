import { Request, Response } from "express";
import { prisma } from "../prisma/client";

export async function getApplicationsByEnrollment(
  req: Request,
  res: Response
) {
    
const raw = req.params.enrollmentNo;

if (!raw || Array.isArray(raw)) {
  return res.status(400).json({
    message: "Invalid enrollment number",
  });
}

const enrollmentNo = raw;


  if (!enrollmentNo) {
    return res.status(400).json({ message: "Enrollment number is required" });
  }

  const student = await prisma.student.findUnique({
    where: { enrollmentNo },
  });

  if (!student) {
    return res.json([]); // IMPORTANT: do not leak info
  }

  const applications = await prisma.concessionApplication.findMany({
    where: { studentId: student.id },
    orderBy: { appliedAt: "desc" },
  });

  return res.json(applications);
}
