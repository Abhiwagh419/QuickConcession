"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getApplicationsByEnrollment = getApplicationsByEnrollment;
const client_1 = require("../prisma/client");
async function getApplicationsByEnrollment(req, res) {
    const raw = req.params.enrollmentNo;
    if (!raw || Array.isArray(raw)) {
        return res.status(400).json({
            message: "Invalid enrollment number",
        });
    }
    const enrollmentNo = raw;
    if (!enrollmentNo) {
        return res.status(400).json({ message: "Enrollment number is required" });
    }
    const student = await client_1.prisma.student.findUnique({
        where: { enrollmentNo },
    });
    if (!student) {
        return res.json([]);
    }
    const applications = await client_1.prisma.concessionApplication.findMany({
        where: { studentId: student.id },
        orderBy: { appliedAt: "desc" },
    });
    return res.json(applications);
}
