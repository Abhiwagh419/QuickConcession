"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetStaffPassword = exports.requestStaffPasswordReset = void 0;
exports.staffLogin = staffLogin;
exports.verifyStaffOtp = verifyStaffOtp;
const client_1 = require("../prisma/client");
const password_1 = require("../utils/password");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const mailer_1 = require("../utils/mailer");
const OTP_EXPIRY_MINUTES = 10;
async function staffLogin(req, res) {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required",
            });
        }
        const staff = await client_1.prisma.staff.findUnique({
            where: { email },
        });
        if (!staff) {
            return res.status(401).json({
                message: "Invalid credentials",
            });
        }
        const isPasswordValid = await (0, password_1.verifyPassword)(password, staff.passwordHash);
        if (!isPasswordValid) {
            return res.status(401).json({
                message: "Invalid credentials",
            });
        }
        // Invalidate previous OTPs
        await client_1.prisma.otpVerification.updateMany({
            where: {
                staffId: staff.id,
                isUsed: false,
                expiresAt: { gt: new Date() },
            },
            data: { isUsed: true },
        });
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpHash = await bcryptjs_1.default.hash(otp, 10);
        await client_1.prisma.otpVerification.create({
            data: {
                staffId: staff.id,
                otpHash,
                expiresAt: new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000),
            },
        });
        const ip = req.ip || "Unknown IP";
        const device = typeof req.headers["user-agent"] === "string"
            ? req.headers["user-agent"]
            : "Unknown Device";
        const time = new Date().toLocaleString("en-IN", {
            dateStyle: "medium",
            timeStyle: "short",
        });
        await (0, mailer_1.sendStaffLoginOtpMail)(staff.email, otp, staff.fullName, ip, device, time);
        return res.json({
            message: "OTP sent to registered email",
        });
    }
    catch (error) {
        console.error("Staff login error:", error);
        return res.status(500).json({
            message: "Internal server error",
        });
    }
}
async function verifyStaffOtp(req, res) {
    try {
        const { email, otp } = req.body;
        if (!email || !otp) {
            return res.status(400).json({ message: "Invalid request" });
        }
        const staff = await client_1.prisma.staff.findUnique({
            where: { email },
        });
        if (!staff) {
            return res.status(400).json({ message: "Invalid OTP or expired OTP" });
        }
        const otpEntry = await client_1.prisma.otpVerification.findFirst({
            where: {
                staffId: staff.id,
                isUsed: false,
                expiresAt: { gt: new Date() },
            },
            orderBy: { createdAt: "desc" },
        });
        if (!otpEntry) {
            return res.status(400).json({ message: "Invalid OTP or expired OTP" });
        }
        const isValidOtp = await bcryptjs_1.default.compare(otp, otpEntry.otpHash);
        if (!isValidOtp) {
            return res.status(400).json({ message: "Invalid OTP or expired OTP" });
        }
        await client_1.prisma.otpVerification.update({
            where: { id: otpEntry.id },
            data: { isUsed: true },
        });
        const token = jsonwebtoken_1.default.sign({
            sub: staff.id,
            id: staff.id,
            role: staff.role,
            email: staff.email,
            name: staff.fullName,
            staffId: staff.id,
        }, process.env.JWT_SECRET, { expiresIn: "1d" });
        return res.json({ token });
    }
    catch (error) {
        console.error("Verify staff OTP error:", error);
        return res.status(500).json({
            message: "Internal server error",
        });
    }
}
const requestStaffPasswordReset = async (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.status(200).json({
            message: "If the email exists, an OTP has been sent to the registered address.",
        });
    }
    const staff = await client_1.prisma.staff.findUnique({
        where: { email },
    });
    if (!staff) {
        return res.status(200).json({
            message: "If the email exists, an OTP has been sent to the registered address.",
        });
    }
    await client_1.prisma.otpVerification.updateMany({
        where: {
            staffId: staff.id,
            isUsed: false,
            expiresAt: { gt: new Date() },
        },
        data: { isUsed: true },
    });
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpHash = await bcryptjs_1.default.hash(otp, 10);
    await client_1.prisma.otpVerification.create({
        data: {
            staffId: staff.id,
            otpHash,
            expiresAt: new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000),
        },
    });
    const ip = req.ip || "Unknown IP";
    const device = typeof req.headers["user-agent"] === "string"
        ? req.headers["user-agent"]
        : "Unknown Device";
    const time = new Date().toLocaleString("en-IN", {
        dateStyle: "medium",
        timeStyle: "short",
    });
    await (0, mailer_1.sendStaffPasswordResetOtpMail)(staff.email, otp, staff.fullName, ip, device, time);
    return res.status(200).json({
        message: "If the email exists, an OTP has been sent to the registered address.",
    });
};
exports.requestStaffPasswordReset = requestStaffPasswordReset;
const resetStaffPassword = async (req, res) => {
    const { email, otp, newPassword } = req.body;
    if (!email || !otp || !newPassword) {
        return res.status(400).json({ message: "Invalid request" });
    }
    const staff = await client_1.prisma.staff.findUnique({
        where: { email },
    });
    if (!staff) {
        return res.status(400).json({ message: "Invalid OTP or expired OTP" });
    }
    const otpEntry = await client_1.prisma.otpVerification.findFirst({
        where: {
            staffId: staff.id,
            isUsed: false,
            expiresAt: { gt: new Date() },
        },
        orderBy: { createdAt: "desc" },
    });
    if (!otpEntry) {
        return res.status(400).json({ message: "Invalid OTP or expired OTP" });
    }
    const isValidOtp = await bcryptjs_1.default.compare(otp, otpEntry.otpHash);
    if (!isValidOtp) {
        return res.status(400).json({ message: "Invalid OTP or expired OTP" });
    }
    const passwordHash = await bcryptjs_1.default.hash(newPassword, 12);
    await client_1.prisma.$transaction([
        client_1.prisma.staff.update({
            where: { id: staff.id },
            data: { passwordHash },
        }),
        client_1.prisma.otpVerification.update({
            where: { id: otpEntry.id },
            data: { isUsed: true },
        }),
    ]);
    return res.status(200).json({
        message: "Password reset successful",
    });
};
exports.resetStaffPassword = resetStaffPassword;
