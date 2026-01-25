import { Router } from "express";
import { getConcessionApplications } from "../controllers/staffConcession.controller";
import { requireAuth } from "../middleware/requireAuth";
import { requireStaff } from "../middleware/requireStaff";
import { getConcessionApplicationById } from "../controllers/staffConcession.controller";
import { getStaffMe } from "../controllers/staff.controller";
import { getApplicationsByEnrollment } from "../controllers/staffApplications.controller";

const router = Router();
router.get("/me", requireAuth, requireStaff, getStaffMe);

router.get(
  "/concessions",
  requireAuth,
  requireStaff,
  getConcessionApplications,
);

import {
  approveConcessionApplication,
  rejectConcessionApplication,
} from "../controllers/staffConcession.controller";

router.post(
  "/concessions/:id/approve",
  requireAuth,
  requireStaff,
  approveConcessionApplication,
);

router.post(
  "/concessions/:id/reject",
  requireAuth,
  requireStaff,
  rejectConcessionApplication,
);

router.get(
  "/concessions/:id",
  requireAuth,
  requireStaff,
  getConcessionApplicationById,
);

router.get(
  "/applications/by-enrollment/:enrollmentNo",
  requireAuth,
  requireStaff,
  getApplicationsByEnrollment
);

import { getStudentSummary } from "../controllers/staffStudent.controller";

router.get(
  "/students/:enrollmentNo/summary",
  requireAuth,
  requireStaff,
  getStudentSummary
);

export default router;
