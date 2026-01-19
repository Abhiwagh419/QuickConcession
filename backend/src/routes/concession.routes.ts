import { Router } from "express";
import { applyConcession } from "../controllers/concession.controller";
import { requireAuth } from "../middleware/auth.middleware";
import { prisma } from "../prisma"; // adjust path if needed

const router = Router();

/**
 * Apply for concession (student)
 */
router.post("/apply", requireAuth, applyConcession);

/**
 * Get logged-in student's concession applications
 */
router.get("/my", requireAuth, async (req, res) => {
  try {
    console.log("REQ.USER =", req.user);

    const studentId = req.user!.sub;

    const applications = await prisma.concessionApplication.findMany({
      where: { studentId },
      orderBy: { appliedAt: "desc" },
      select: {
        id: true,
        status: true,
        fromLine: true,
        toLine: true,
        fromStation: true,
        toStation: true,
        duration: true,
        expiryDate: true,
        appliedAt: true,
        rejectionReason: true,
        travelClass: true,
        student: {
          select: {
            enrollmentNo: true,
          },
        },
        approvedAt: true,
        concessionNumber: true,
      },
    });

    res.json(applications);
  } catch (err) {
    console.error("ERROR IN /concession/my:", err);
    res.status(500).json({ message: "Failed to fetch applications" });
  }
});

export default router;
