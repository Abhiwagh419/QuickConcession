"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAuth = requireAuth;
const jwt_1 = require("../utils/jwt");
function requireAuth(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
            message: "Authorization token missing",
        });
    }
    const token = authHeader.split(" ")[1];
    try {
        const payload = (0, jwt_1.verifyJwt)(token);
        req.user = payload;
        next();
    }
    catch (err) {
        return res.status(401).json({
            message: "Invalid or expired token",
        });
    }
}
