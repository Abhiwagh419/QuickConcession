"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyOtpHash = exports.hashOtp = exports.generateOtp = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();
exports.generateOtp = generateOtp;
const hashOtp = async (otp) => {
    const salt = await bcrypt_1.default.genSalt(10);
    return bcrypt_1.default.hash(otp, salt);
};
exports.hashOtp = hashOtp;
const verifyOtpHash = async (otp, hash) => {
    return bcrypt_1.default.compare(otp, hash);
};
exports.verifyOtpHash = verifyOtpHash;
