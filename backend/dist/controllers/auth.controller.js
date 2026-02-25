"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyOtp = exports.login = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma_1 = require("../prisma");
const otp_1 = require("../utils/otp");
const mailer_1 = require("../utils/mailer");
const OTP_EXP_MIN = Number(process.env.OTP_EXPIRY_MINUTES || 5);
const login = async (req, res) => {
    const { enrollmentNo, password } = req.body;
    if (!enrollmentNo || !password) {
        return res.status(400).json({ message: "Missing credentials" });
    }
    const student = await prisma_1.prisma.student.findUnique({
        where: { enrollmentNo },
    });
    if (!student) {
        return res.status(401).json({ message: "Invalid credentials" });
    }
    if (student.isDeleted) {
        return res.status(403).json({
            message: "Your account has been removed from the system.",
        });
    }
    if (!student.active) {
        return res.status(403).json({
            message: "Your account has been deactivated. Please contact administration.",
        });
    }
    const ok = await bcrypt_1.default.compare(password, student.passwordHash);
    if (!ok) {
        return res.status(401).json({ message: "Invalid credentials" });
    }
    const otp = (0, otp_1.generateOtp)();
    const otpHash = await (0, otp_1.hashOtp)(otp);
    const expiresAt = new Date(Date.now() + OTP_EXP_MIN * 60 * 1000);
    const ip = req.ip || "Unknown IP";
    const device = req.headers["user-agent"] || "Unknown Device";
    const time = new Date().toLocaleString("en-IN", {
        dateStyle: "medium",
        timeStyle: "short",
    });
    await prisma_1.prisma.otpVerification.create({
        data: {
            studentId: student.id,
            otpHash,
            expiresAt,
        },
    });
    await (0, mailer_1.sendOtpMail)(student.email, otp, student.fullName, ip, device, time);
    return res.json({ message: "OTP sent to registered email" });
};
exports.login = login;
const verifyOtp = async (req, res) => {
    const { enrollmentNo, otp } = req.body;
    if (!enrollmentNo || !otp) {
        return res.status(400).json({ message: "Missing OTP data" });
    }
    const student = await prisma_1.prisma.student.findUnique({
        where: { enrollmentNo },
    });
    if (!student) {
        return res.status(401).json({ message: "Invalid request" });
    }
    if (student.isDeleted) {
        return res.status(403).json({
            message: "Your account has been removed from the system.",
        });
    }
    if (!student.active) {
        return res.status(403).json({
            message: "Your account has been deactivated. Please contact administration.",
        });
    }
    const record = await prisma_1.prisma.otpVerification.findFirst({
        where: {
            studentId: student.id,
            isUsed: false,
            expiresAt: { gt: new Date() },
        },
        orderBy: { createdAt: "desc" },
    });
    if (!record) {
        return res.status(401).json({ message: "OTP expired or invalid" });
    }
    const ok = await (0, otp_1.verifyOtpHash)(otp, record.otpHash);
    if (!ok) {
        return res.status(401).json({ message: "Invalid OTP" });
    }
    await prisma_1.prisma.otpVerification.update({
        where: { id: record.id },
        data: { isUsed: true },
    });
    const token = jsonwebtoken_1.default.sign({
        sub: student.id,
        id: student.id,
        role: "STUDENT",
        email: student.email,
        name: student.fullName,
    }, process.env.JWT_SECRET, { expiresIn: "1d" });
    return res.json({ token });
};
exports.verifyOtp = verifyOtp;
