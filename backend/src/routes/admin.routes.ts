import { Router } from "express";
import { prisma } from "../prisma/client";
import { requireAuth } from "../middleware/requireAuth";
import bcrypt from "bcryptjs";

const router = Router();

router.get("/students", requireAuth, async (req: any, res) => {
  if (req.user.role !== "ADMIN") {
    return res.status(403).json({ message: "Forbidden" });
  }

const showDeleted = req.query.deleted === "true";

const students = await prisma.student.findMany({
  where: { isDeleted: showDeleted },

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

/*
  RESTORE DELETED STUDENT
*/
router.patch("/students/:id/restore", requireAuth, async (req: any, res) => {
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

  await prisma.student.update({
    where: { id: studentId },
    data: { isDeleted: false },
  });

  res.json({ message: "Student restored successfully" });
});
/*
  ADMIN SET STUDENT PASSWORD
*/
router.post("/students/:id/reset-password", requireAuth, async (req: any, res) => {
  if (req.user.role !== "ADMIN") {
    return res.status(403).json({ message: "Forbidden" });
  }

  const studentId = Number(req.params.id);
  const { newPassword } = req.body;

  if (!newPassword || newPassword.length < 6) {
    return res.status(400).json({
      message: "Password must be at least 6 characters",
    });
  }

  const student = await prisma.student.findUnique({
    where: { id: studentId },
  });

  if (!student) {
    return res.status(404).json({ message: "Student not found" });
  }

  const passwordHash = await bcrypt.hash(newPassword, 12);

  await prisma.student.update({
    where: { id: studentId },
    data: { passwordHash },
  });

  res.json({ message: "Password updated successfully" });
});

/*
  UPDATE STUDENT (ADMIN INLINE EDIT)
*/
router.patch("/students/:id", requireAuth, async (req: any, res) => {
  if (req.user.role !== "ADMIN") {
    return res.status(403).json({ message: "Forbidden" });
  }

  const studentId = Number(req.params.id);

  const {
    fullName,
    email,
    mobileNumber,
    course,
    year,
    sem,
    shift,
    address,
    dateOfBirth,
  } = req.body;

  const updated = await prisma.student.update({
    where: { id: studentId },
    data: {
      fullName,
      email,
      mobileNumber,
      course,
      year,
      sem,
      shift,
      address,
      dateOfBirth: dateOfBirth
        ? new Date(dateOfBirth)
        : null,
    },
  });

  res.json(updated);
});

/*
  GET STUDENT DETAILS BY ID (ADMIN)
*/
router.get("/students/:id", requireAuth, async (req: any, res) => {
  if (req.user.role !== "ADMIN") {
    return res.status(403).json({ message: "Forbidden" });
  }

  const studentId = Number(req.params.id);

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
      address: true,
      dateOfBirth: true,
    },
  });

  if (!student) {
    return res.status(404).json({ message: "Student not found" });
  }

  res.json(student);
});

// GET APPLICATION DETAILS BY ID (ADMIN)
router.get("/applications/:id", requireAuth, async (req: any, res) => {
  if (req.user.role !== "ADMIN") {
    return res.status(403).json({ message: "Forbidden" });
  }

  const id = Number(req.params.id);

  const application = await prisma.concessionApplication.findUnique({
    where: { id },
    include: {
      student: true,
      approvedBy: true,
    },
  });

  if (!application) {
    return res.status(404).json({ message: "Application not found" });
  }

  res.json(application);
});


/*
  GET STUDENT WITH APPLICATIONS (ADMIN)
*/
router.get("/students/:id/full", requireAuth, async (req: any, res) => {
  if (req.user.role !== "ADMIN") {
    return res.status(403).json({ message: "Forbidden" });
  }

  const studentId = Number(req.params.id);

  const student = await prisma.student.findUnique({
    where: { id: studentId },
    include: {
      applications: {
        orderBy: { appliedAt: "desc" },
      },
    },
  });

  if (!student) {
    return res.status(404).json({ message: "Student not found" });
  }

  // ---------- ANALYTICS ----------
  const total = student.applications.length;

  const approved = student.applications.filter(
    a => a.status === "APPROVED"
  ).length;

  const rejected = student.applications.filter(
    a => a.status === "REJECTED"
  ).length;

  const issued = student.applications.filter(
    a => a.status === "ISSUED" || a.status === "EXPIRED"
  ).length;

  const pending = student.applications.filter(
    a => a.status === "PENDING"
  ).length;

  const approvalRate =
    total === 0 ? 0 : Math.round(((approved + issued) / total) * 100);

  res.json({
    ...student,
    analytics: {
      total,
      approved,
      rejected,
      issued,
      pending,
      approvalRate,
    },
  });
});

export default router;
