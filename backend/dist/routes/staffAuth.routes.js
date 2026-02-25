"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const staffAuth_controller_1 = require("../controllers/staffAuth.controller");
const router = (0, express_1.Router)();
router.post("/login", staffAuth_controller_1.staffLogin);
router.post("/verify-otp", staffAuth_controller_1.verifyStaffOtp);
exports.default = router;
