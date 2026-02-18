import { Router } from "express";
import { prisma } from "../prisma/client";
import { requireAuth } from "../middleware/requireAuth";
import bcrypt from "bcryptjs";

const router = Router();

router.get("/students", requireAuth, async (req: any, res) => {
  if (req.user.role !== "ADMIN") {
    return res.status(403).json({ message: "Forbidden" });
  }

  const students = await prisma.student.findMany({
  where: { isDeleted: false }, 

    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      enrollmentNo: true,
      fullName: true,
      email: true,
      course: true,
      year: true,
      sem: true,
      shift: true,
      active: true, 
      createdAt: true,
    },
  });

  res.json(students);
});

/*
  CREATE STUDENT
*/
router.post("/students", requireAuth, async (req: any, res) => {
  if (req.user.role !== "ADMIN") {
    return res.status(403).json({ message: "Forbidden" });
  }

  const {
    enrollmentNo,
    fullName,
    email,
    mobileNumber,
    course,
    year,
    sem,
    shift,
    password,
    dateOfBirth,
    address,
  } = req.body;

  if (!enrollmentNo || !fullName || !email || !password) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const existing = await prisma.student.findFirst({
    where: {
      OR: [{ enrollmentNo }, { email }],
    },
  });

  if (existing) {
    return res.status(400).json({
      message: "Enrollment number or email already exists",
    });
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const student = await prisma.student.create({
    data: {
      enrollmentNo,
      fullName,
      email,
      mobileNumber,
      course,
      year,
      sem,
      shift,
      passwordHash,
      dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
      address,
    },
  });

  res.status(201).json(student);
});

/*
  TOGGLE STUDENT ACTIVE STATUS
*/
router.patch("/students/:id/toggle", requireAuth, async (req: any, res) => {
  if (req.user.role !== "ADMIN") {
    return res.status(403).json({ message: "Forbidden" });
  }

  const studentId = Number(req.params.id);

  const student = await prisma.student.findUnique({
    where: { id: studentId },
  });

  if (!student) {
    return res.status(404).json({ message: "Student not found" });
  }

  const updated = await prisma.student.update({
    where: { id: studentId },
    data: { active: !student.active },
  });

  res.json({
    message: "Student status updated",
    active: updated.active,
  });
});

/*
  SOFT DELETE STUDENT
*/
router.patch("/students/:id/delete", requireAuth, async (req: any, res) => {
  if (req.user.role !== "ADMIN") {
    return res.status(403).json({ message: "Forbidden" });
  }

  const studentId = Number(req.params.id);

  await prisma.student.update({
    where: { id: studentId },
    data: { isDeleted: true },
  });

  res.json({ message: "Student deleted successfully" });
});

export default router;
