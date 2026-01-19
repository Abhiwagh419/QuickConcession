import { prisma } from "../prisma";
import { Request, Response } from "express";

export const getMe = async (req: Request, res: Response) => {
  const studentId = req.user!.sub;

  if (!studentId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const student = await prisma.student.findUnique({
    where: { id: studentId },
    select: {
      enrollmentNo: true,
      fullName: true,
      email: true,
      mobileNumber: true,
      course: true,
      year: true,
      sem: true,
      shift: true,
      createdAt: true,
    },
  });

  if (!student) {
    return res.status(404).json({ message: "Student not found" });
  }

  return res.json(student);
};
