"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStudentSummary = void 0;
const client_1 = require("../prisma/client");
const getStudentSummary = async (req, res) => {
    const enrollmentNo = String(req.params.enrollmentNo);
    const student = await client_1.prisma.student.findUnique({
        where: { enrollmentNo },
        select: {
            enrollmentNo: true,
            fullName: true,
            email: true,
            mobileNumber: true,
            course: true,
            year: true,
            sem: true,
            shift: true,
            address: true,
            dateOfBirth: true,
        },
    });
    if (!student) {
        return res.status(404).json({ message: "Student not found" });
    }
    const [total, issued, rejected, pending, latest] = await Promise.all([
        client_1.prisma.concessionApplication.count({
            where: { student: { enrollmentNo } },
        }),
        client_1.prisma.concessionApplication.count({
            where: {
                student: { enrollmentNo },
                status: { in: ["ISSUED", "EXPIRED"] },
            },
        }),
        client_1.prisma.concessionApplication.count({
            where: {
                student: { enrollmentNo },
                status: "REJECTED",
            },
        }),
        client_1.prisma.concessionApplication.count({
            where: {
                student: { enrollmentNo },
                status: "PENDING",
            },
        }),
        client_1.prisma.concessionApplication.findFirst({
            where: { student: { enrollmentNo } },
            orderBy: { appliedAt: "desc" },
            select: {
                status: true,
                fromStation: true,
                toStation: true,
                appliedAt: true,
            },
        }),
    ]);
    return res.json({
        student,
        stats: {
            total,
            issued,
            pending,
            rejected,
        },
        latest,
    });
};
exports.getStudentSummary = getStudentSummary;
