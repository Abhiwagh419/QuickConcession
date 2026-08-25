"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStaffMe = getStaffMe;
const client_1 = require("../prisma/client");
async function getStaffMe(req, res) {
    try {
        const staffId = req.user.sub;
        const staff = await client_1.prisma.staff.findUnique({
            where: { id: staffId },
            select: {
                id: true,
                fullName: true,
                email: true,
                role: true,
            },
        });
        if (!staff) {
            return res.status(404).json({ message: "Staff not found" });
        }
        return res.json(staff);
    }
    catch (err) {
        console.error("Get staff me error:", err);
        return res.status(500).json({ message: "Internal server error" });
    }
}
