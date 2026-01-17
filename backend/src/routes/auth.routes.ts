import { Router } from "express";
import { login, verifyOtp } from "../controllers/auth.controller";
import {
  requestStudentPasswordReset,
  resetStudentPassword,
} from "../controllers/studentAuth.controller";
import {
  staffLogin,
  requestStaffPasswordReset,
  resetStaffPassword,
} from "../controllers/staffAuth.controller";

const router = Router();

router.post("/login", login);
router.post("/verify-otp", verifyOtp);
router.post("/student/forgot-password", requestStudentPasswordReset);
router.post("/student/reset-password", resetStudentPassword);
router.post("/staff/login", staffLogin);
router.post("/staff/forgot-password", requestStaffPasswordReset);
router.post("/staff/reset-password", resetStaffPassword);

export default router;
