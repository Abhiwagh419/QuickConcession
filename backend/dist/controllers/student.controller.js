"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMe = void 0;
const prisma_1 = require("../prisma");
const getMe = async (req, res) => {
    const studentId = req.user.sub;
    if (!studentId) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    const student = await prisma_1.prisma.student.findUnique({
        where: { id: studentId },
        select: {
            enrollmentNo: true,
            fullName: true,
            email: true,
            mobileNumber: true,
            course: true,
            year: true,
            sem: true,
            shift: true,
            createdAt: true,
        },
    });
    if (!student) {
        return res.status(404).json({ message: "Student not found" });
    }
    return res.json(student);
};
exports.getMe = getMe;
