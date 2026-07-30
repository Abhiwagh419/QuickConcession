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
import {
  loginLimiter,
  otpVerifyLimiter,
  otpRequestLimiter,
} from "../middleware/rateLimit";

const router = Router();

router.post("/login", loginLimiter, login);
router.post("/verify-otp", otpVerifyLimiter, verifyOtp);
router.post(
  "/student/forgot-password",
  otpRequestLimiter,
  requestStudentPasswordReset,
);
router.post(
  "/student/reset-password",
  otpVerifyLimiter,
  resetStudentPassword,
);
router.post("/staff/login", loginLimiter, staffLogin);
router.post(
  "/staff/forgot-password",
  otpRequestLimiter,
  requestStaffPasswordReset,
);
router.post("/staff/reset-password", otpVerifyLimiter, resetStaffPassword);

export default router;
