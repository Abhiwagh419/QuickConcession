"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signJwt = signJwt;
exports.verifyJwt = verifyJwt;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = "1d";
if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in environment variables");
}
function signJwt(payload) {
    return jsonwebtoken_1.default.sign(payload, JWT_SECRET, {
        expiresIn: JWT_EXPIRES_IN,
    });
}
function verifyJwt(token) {
    const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
    if (typeof decoded !== "object" ||
        decoded === null ||
        !("sub" in decoded) ||
        !("id" in decoded) ||
        !("role" in decoded)) {
        throw new Error("Invalid JWT payload");
    }
    const { sub, id, role, email, name } = decoded;
    if (typeof sub !== "number" || typeof id !== "number") {
        throw new Error("Invalid JWT subject");
    }
    if (role !== "STUDENT" && role !== "STAFF" && role !== "ADMIN") {
        throw new Error("Invalid JWT role");
    }
    return {
        sub,
        id,
        role: role,
        email: typeof email === "string" ? email : undefined,
        name: typeof name === "string" ? name : undefined,
    };
}
