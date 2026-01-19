import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware";
import { prisma } from "../prisma";

const router = Router();

router.get("/me", requireAuth, async (req, res) => {
  const studentId = req.user!.sub;

  const student = await prisma.student.findUnique({
    where: { id: studentId },
    select: {
      id: true,
      enrollmentNo: true,
      fullName: true,
      email: true,
      mobileNumber: true,
      course: true,
      year: true,
      sem: true,
      shift: true,
      createdAt: true,
      dateOfBirth: true,
      address: true,
    },
  });

  res.json(student);
});

router.put("/me", requireAuth, async (req, res) => {
  try {
    const studentId = req.user!.sub;

    const { year, sem, shift, email, mobileNumber, address, dateOfBirth } =
      req.body;

    const updatedStudent = await prisma.student.update({
      where: { id: studentId },
      data: {
        year,
        sem,
        shift,
        email,
        mobileNumber,
        address,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
      },
      select: {
        id: true,
        enrollmentNo: true,
        fullName: true,
        email: true,
        mobileNumber: true,
        course: true,
        year: true,
        sem: true,
        shift: true,
        dateOfBirth: true,
        address: true,
      },
    });

    res.json(updatedStudent);
  } catch (err) {
    console.error("UPDATE PROFILE ERROR:", err);
    res.status(500).json({ message: "Failed to update profile" });
  }
});

export default router;
