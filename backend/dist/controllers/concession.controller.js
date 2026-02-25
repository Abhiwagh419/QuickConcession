"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.applyConcession = void 0;
const prisma_1 = require("../prisma");
const applyConcession = async (req, res) => {
    const studentId = req.user.sub;
    const { fromLine, toLine, fromStation, toStation, travelClass, duration } = req.body;
    if (!fromLine ||
        !toLine ||
        !fromStation ||
        !toStation ||
        !travelClass ||
        !duration) {
        return res.status(400).json({ message: "Missing fields" });
    }
    const existing = await prisma_1.prisma.concessionApplication.findFirst({
        where: {
            studentId,
            status: { in: ["PENDING", "APPROVED"] },
        },
        orderBy: { appliedAt: "desc" },
    });
    if (existing) {
        if (existing.status === "PENDING") {
            return res.status(400).json({
                message: "You already have a pending application",
            });
        }
        if (existing.status === "APPROVED") {
            if (existing.expiryDate && existing.expiryDate > new Date()) {
                return res.status(400).json({
                    message: "Your current concession has not expired yet",
                });
            }
        }
    }
    const application = await prisma_1.prisma.concessionApplication.create({
        data: {
            studentId,
            fromLine,
            toLine,
            fromStation,
            toStation,
            travelClass,
            duration,
            status: "PENDING",
        },
    });
    return res.status(201).json(application);
};
exports.applyConcession = applyConcession;
