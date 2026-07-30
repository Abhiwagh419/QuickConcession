import { Request, Response } from "express";
import { prisma } from "../prisma/client";

export const getStudentSummary = async (req: Request, res: Response) => {
  const enrollmentNo = String(req.params.enrollmentNo);
  const student = await prisma.student.findUnique({
    where: { enrollmentNo },
    select: {
      enrollmentNo: true,
      fullName: true,
      email: true,
      mobileNumber: true,
      course: true,
      year: true,
      sem: true,
      shift: true,
      address: true,
      dateOfBirth: true,
    },
  });

  if (!student) {
    return res.status(404).json({ message: "Student not found" });
  }

  const [total, issued, rejected, pending, latest] = await Promise.all([
    prisma.concessionApplication.count({
      where: { student: { enrollmentNo } },
    }),

    prisma.concessionApplication.count({
      where: {
        student: { enrollmentNo },
        status: { in: ["ISSUED", "EXPIRED"] },
      },
    }),

    prisma.concessionApplication.count({
      where: {
        student: { enrollmentNo },
        status: "REJECTED",
      },
    }),

    prisma.concessionApplication.count({
      where: {
        student: { enrollmentNo },
        status: "PENDING",
      },
    }),

    prisma.concessionApplication.findFirst({
      where: { student: { enrollmentNo } },
      orderBy: { appliedAt: "desc" },
      select: {
        status: true,
        fromStation: true,
        toStation: true,
        appliedAt: true,
      },
    }),
  ]);

  return res.json({
    student,
    stats: {
      total,
      issued,
      pending,
      rejected,
    },
    latest,
  });
};
