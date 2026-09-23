"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.aiChatLimiter = exports.otpRequestLimiter = exports.otpVerifyLimiter = exports.loginLimiter = exports.generalLimiter = void 0;
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
/**
 * Why keys matter here:
 *
 * express-rate-limit buckets requests by `req.ip` unless you tell it
 * otherwise. On a college network, dozens/hundreds of students behind the
 * same classroom Wi-Fi (or the same NAT/proxy) all share ONE public IP.
 * A pure per-IP bucket means the first handful of login attempts from
 * *anyone* on that network exhausts the limit for *everyone* on it — the
 * opposite of "everyone should be served".
 *
 * So for auth-type endpoints we key on IP + the account identifier the
 * user is submitting (email/enrollment number), when present. That keeps
 * the original goal (stop brute-forcing one account) without letting one
 * shared IP lock out the whole class. If no identifier is present yet
 * (e.g. malformed request), we safely fall back to IP alone.
 *
 * For the AI chat limiter, the request is already authenticated, so we key
 * by the logged-in user's id instead of IP — far more accurate, and again
 * avoids one shared classroom IP throttling every student at once.
 */
function identifierAndIpKey(req) {
    const body = (req.body ?? {});
    const identifier = (typeof body.email === "string" && body.email.toLowerCase().trim()) ||
        (typeof body.enrollmentNo === "string" && body.enrollmentNo.trim()) ||
        "unknown";
    return `${req.ip}:${identifier}`;
}
function userOrIpKey(req) {
    const userId = req.user?.sub;
    return userId ? `user:${userId}` : `ip:${req.ip}`;
}
// Broad safety net applied to every request (see app.ts). This exists to
// stop runaway loops, misbehaving clients, or scripted abuse from taking
// the server down — it should almost never trigger for normal classroom
// usage, since normal usage is a handful of clicks per user per minute.
exports.generalLimiter = (0, express_rate_limit_1.default)({
    windowMs: 5 * 60 * 1000,
    limit: 600, // ~2 req/sec sustained per client, generous burst allowance
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: "Too many requests. Please slow down." },
});
exports.loginLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    limit: 30,
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: identifierAndIpKey,
    message: { message: "Too many login attempts. Please try again later." },
});
exports.otpVerifyLimiter = (0, express_rate_limit_1.default)({
    windowMs: 10 * 60 * 1000,
    limit: 15,
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: identifierAndIpKey,
    message: { message: "Too many OTP attempts. Please request a new OTP." },
});
exports.otpRequestLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    limit: 10,
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: identifierAndIpKey,
    message: { message: "Too many requests. Please try again later." },
});
exports.aiChatLimiter = (0, express_rate_limit_1.default)({
    windowMs: 5 * 60 * 1000,
    limit: 30,
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: userOrIpKey,
    message: { message: "Too many assistant requests. Please slow down." },
});
