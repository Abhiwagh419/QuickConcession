"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireStaff = requireStaff;
function requireStaff(req, res, next) {
    if (!req.user) {
        return res.status(401).json({
            message: "Unauthenticated",
        });
    }
    if (req.user.role !== "STAFF" && req.user.role !== "ADMIN") {
        return res.status(403).json({ message: "Staff access required" });
    }
    next();
}
