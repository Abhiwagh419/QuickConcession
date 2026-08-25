"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetStudentPassword = exports.requestStudentPasswordReset = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const client_1 = require("../prisma/client");
const mailer_1 = require("../utils/mailer");
const OTP_EXPIRY_MINUTES = 10;
const requestStudentPasswordReset = async (req, res) => {
    const { enrollmentNo } = req.body;
    if (!enrollmentNo) {
        return res.status(200).json({
            message: "If the enrollment number exists, an OTP has been sent to the registered email.",
        });
    }
    const student = await client_1.prisma.student.findUnique({
        where: { enrollmentNo },
    });
    if (!student) {
        return res.status(200).json({
            message: "If the enrollment number exists, an OTP has been sent to the registered email.",
        });
    }
    await client_1.prisma.otpVerification.updateMany({
        where: {
            studentId: student.id,
            isUsed: false,
            expiresAt: { gt: new Date() },
        },
        data: { isUsed: true },
    });
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpHash = await bcrypt_1.default.hash(otp, 10);
    const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);
    await client_1.prisma.otpVerification.create({
        data: {
            studentId: student.id,
            otpHash,
            expiresAt,
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
    await (0, mailer_1.sendPasswordResetOtpMail)(student.email, otp, student.fullName, ip, device, time);
    return res.status(200).json({
        message: "If the enrollment number exists, an OTP has been sent to the registered email.",
    });
};
exports.requestStudentPasswordReset = requestStudentPasswordReset;
const resetStudentPassword = async (req, res) => {
    const { enrollmentNo, otp, newPassword } = req.body;
    if (!enrollmentNo || !otp || !newPassword) {
        return res.status(400).json({ message: "Invalid request" });
    }
    const student = await client_1.prisma.student.findUnique({
        where: { enrollmentNo },
    });
    if (!student) {
        return res.status(400).json({ message: "Invalid OTP or expired OTP" });
    }
    const otpEntry = await client_1.prisma.otpVerification.findFirst({
        where: {
            studentId: student.id,
            isUsed: false,
            expiresAt: { gt: new Date() },
        },
        orderBy: { createdAt: "desc" },
    });
    if (!otpEntry) {
        return res.status(400).json({ message: "Invalid OTP or expired OTP" });
    }
    const isValidOtp = await bcrypt_1.default.compare(otp, otpEntry.otpHash);
    if (!isValidOtp) {
        return res.status(400).json({ message: "Invalid OTP or expired OTP" });
    }
    const passwordHash = await bcrypt_1.default.hash(newPassword, 12);
    await client_1.prisma.$transaction([
        client_1.prisma.student.update({
            where: { id: student.id },
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
exports.resetStudentPassword = resetStudentPassword;
