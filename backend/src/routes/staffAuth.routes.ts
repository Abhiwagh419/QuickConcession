import { Router } from "express";
import { staffLogin, verifyStaffOtp } from "../controllers/staffAuth.controller";

const router = Router();

router.post("/login", staffLogin);
router.post("/verify-otp", verifyStaffOtp);

export default router;
