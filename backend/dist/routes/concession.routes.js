"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const concession_controller_1 = require("../controllers/concession.controller");
const requireAuth_1 = require("../middleware/requireAuth");
const prisma_1 = require("../prisma");
const router = (0, express_1.Router)();
router.post("/apply", requireAuth_1.requireAuth, concession_controller_1.applyConcession);
router.get("/my", requireAuth_1.requireAuth, async (req, res) => {
    try {
        console.log("REQ.USER =", req.user);
        const studentId = req.user.sub;
        const applications = await prisma_1.prisma.concessionApplication.findMany({
            where: { studentId },
            orderBy: { appliedAt: "desc" },
            select: {
                id: true,
                status: true,
                fromLine: true,
                toLine: true,
                fromStation: true,
                toStation: true,
                duration: true,
                expiryDate: true,
                appliedAt: true,
                rejectionReason: true,
                travelClass: true,
                student: {
                    select: {
                        enrollmentNo: true,
                    },
                },
                approvedAt: true,
                concessionNumber: true,
            },
        });
        res.json(applications);
    }
    catch (err) {
        console.error("ERROR IN /concession/my:", err);
        res.status(500).json({ message: "Failed to fetch applications" });
    }
});
exports.default = router;
