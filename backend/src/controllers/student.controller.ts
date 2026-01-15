import { Response } from "express";
import { prisma } from "../prisma";
import { AuthRequest } from "../middleware/auth.middleware";

export const getMe = async (req: AuthRequest, res: Response) => {
  const studentId = req.studentId;

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
