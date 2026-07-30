import { Router } from "express";
import { staffLogin, verifyStaffOtp } from "../controllers/staffAuth.controller";
import { loginLimiter, otpVerifyLimiter } from "../middleware/rateLimit";

const router = Router();

router.post("/login", loginLimiter, staffLogin);
router.post("/verify-otp", otpVerifyLimiter, verifyStaffOtp);

export default router;
