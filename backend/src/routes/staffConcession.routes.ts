import { Router } from "express";
import { getConcessionApplications } from "../controllers/staffConcession.controller";
import { requireAuth } from "../middleware/requireAuth";
import { requireStaff } from "../middleware/requireStaff";

const router = Router();

router.get(
  "/concessions",
  requireAuth,
  requireStaff,
  getConcessionApplications
);

import {
  approveConcessionApplication,
  rejectConcessionApplication,
} from "../controllers/staffConcession.controller";

router.post(
  "/concessions/:id/approve",
  requireAuth,
  requireStaff,
  approveConcessionApplication
);

router.post(
  "/concessions/:id/reject",
  requireAuth,
  requireStaff,
  rejectConcessionApplication
);


export default router;
