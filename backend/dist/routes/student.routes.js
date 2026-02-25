"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../middleware/auth.middleware");
const prisma_1 = require("../prisma");
const router = (0, express_1.Router)();
router.get("/me", auth_middleware_1.requireAuth, async (req, res) => {
    const studentId = req.user.sub;
    const student = await prisma_1.prisma.student.findUnique({
        where: { id: studentId },
        select: {
            id: true,
            enrollmentNo: true,
            fullName: true,
            email: true,
            mobileNumber: true,
            course: true,
            year: true,
            sem: true,
            shift: true,
            createdAt: true,
            dateOfBirth: true,
            address: true,
        },
    });
    res.json(student);
});
router.put("/me", auth_middleware_1.requireAuth, async (req, res) => {
    try {
        const studentId = req.user.sub;
        const { year, sem, shift, email, mobileNumber, address, dateOfBirth } = req.body;
        const updatedStudent = await prisma_1.prisma.student.update({
            where: { id: studentId },
            data: {
                year,
                sem,
                shift,
                email,
                mobileNumber,
                address,
                dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
            },
            select: {
                id: true,
                enrollmentNo: true,
                fullName: true,
                email: true,
                mobileNumber: true,
                course: true,
                year: true,
                sem: true,
                shift: true,
                dateOfBirth: true,
                address: true,
            },
        });
        res.json(updatedStudent);
    }
    catch (err) {
        console.error("UPDATE PROFILE ERROR:", err);
        res.status(500).json({ message: "Failed to update profile" });
    }
});
exports.default = router;
