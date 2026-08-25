"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const staffAuth_controller_1 = require("../controllers/staffAuth.controller");
const rateLimit_1 = require("../middleware/rateLimit");
const router = (0, express_1.Router)();
router.post("/login", rateLimit_1.loginLimiter, staffAuth_controller_1.staffLogin);
router.post("/verify-otp", rateLimit_1.otpVerifyLimiter, staffAuth_controller_1.verifyStaffOtp);
exports.default = router;
