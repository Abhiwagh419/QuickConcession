"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getConcessionApplications = getConcessionApplications;
exports.approveConcessionApplication = approveConcessionApplication;
exports.getConcessionApplicationById = getConcessionApplicationById;
exports.rejectConcessionApplication = rejectConcessionApplication;
const client_1 = require("../prisma/client");
const expiry_1 = require("../utils/expiry");
async function getConcessionApplications(req, res) {
    try {
        const staffId = req.user.sub; // 🔥 IMPORTANT
        // 1️⃣ Global Pending (visible to all staff)
        const pendingApps = await client_1.prisma.concessionApplication.findMany({
            where: {
                status: "PENDING",
            },
            orderBy: {
                appliedAt: "desc",
            },
            include: {
                student: {
                    select: {
                        id: true,
                        fullName: true,
                        enrollmentNo: true,
                        year: true,
                        sem: true,
                        shift: true,
                        email: true,
                    },
                },
            },
        });
        // 2️⃣ Personal Applications (processed by this staff)
        const personalApps = await client_1.prisma.concessionApplication.findMany({
            where: {
                approvedByStaffId: staffId,
            },
            orderBy: {
                appliedAt: "desc",
            },
            include: {
                student: {
                    select: {
                        id: true,
                        fullName: true,
                        enrollmentNo: true,
                        year: true,
                        sem: true,
                        shift: true,
                        email: true,
                    },
                },
            },
        });
        return res.json({
            pending: pendingApps,
            personal: personalApps,
        });
    }
    catch (error) {
        console.error("Fetch staff concessions error:", error);
        return res.status(500).json({
            message: "Internal server error",
        });
    }
}
async function approveConcessionApplication(req, res) {
    try {
        const applicationId = Number(req.params.id);
        const staffId = req.user.sub;
        const { concessionNumber } = req.body;
        if (isNaN(applicationId)) {
            return res.status(400).json({ message: "Invalid application id" });
        }
        const application = await client_1.prisma.concessionApplication.findUnique({
            where: { id: applicationId },
        });
        if (!application) {
            return res.status(404).json({ message: "Application not found" });
        }
        if (application.status === "PENDING") {
            const approvedAt = new Date();
            const expiryDate = (0, expiry_1.calculateExpiryFromApproval)(approvedAt, application.duration);
            const updated = await client_1.prisma.concessionApplication.update({
                where: { id: applicationId },
                data: {
                    status: "APPROVED",
                    approvedAt,
                    expiryDate,
                    approvedByStaffId: staffId,
                },
            });
            return res.json(updated);
        }
        if (application.status === "APPROVED") {
            if (!concessionNumber || typeof concessionNumber !== "string") {
                return res.status(400).json({
                    message: "Concession number is required to issue",
                });
            }
            if (application.status !== "APPROVED") {
                return res.status(400).json({
                    message: "Only approved applications can be issued",
                });
            }
            if (application.concessionNumber) {
                return res.status(400).json({
                    message: "Concession already issued",
                });
            }
            const issuedAt = new Date();
            const expiryDate = (0, expiry_1.calculateExpiryFromApproval)(application.approvedAt, application.duration);
            const updated = await client_1.prisma.concessionApplication.update({
                where: { id: applicationId },
                data: {
                    status: "ISSUED",
                    concessionNumber,
                    expiryDate,
                },
            });
            return res.json(updated);
        }
        return res.status(400).json({
            message: `Cannot process application in ${application.status} state`,
        });
    }
    catch (error) {
        console.error("Approve / Issue concession error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}
async function getConcessionApplicationById(req, res) {
    const applicationId = Number(req.params.id);
    if (isNaN(applicationId)) {
        return res.status(400).json({ message: "Invalid application id" });
    }
    const application = await client_1.prisma.concessionApplication.findUnique({
        where: { id: applicationId },
        include: {
            student: {
                select: {
                    fullName: true,
                    enrollmentNo: true,
                    email: true,
                    mobileNumber: true,
                    address: true,
                    year: true,
                    sem: true,
                    shift: true,
                    dateOfBirth: true,
                    course: true,
                },
            },
            approvedBy: {
                select: {
                    fullName: true,
                    id: true,
                    email: true,
                },
            },
        },
    });
    if (!application) {
        return res.status(404).json({ message: "Application not found" });
    }
    return res.json(application);
}
async function rejectConcessionApplication(req, res) {
    try {
        const applicationId = Number(req.params.id);
        const staffId = req.user.sub;
        const { reason } = req.body;
        if (isNaN(applicationId)) {
            return res.status(400).json({ message: "Invalid application id" });
        }
        if (!reason || typeof reason !== "string") {
            return res.status(400).json({
                message: "Rejection reason is required",
            });
        }
        const application = await client_1.prisma.concessionApplication.findUnique({
            where: { id: applicationId },
        });
        if (!application) {
            return res.status(404).json({ message: "Application not found" });
        }
        if (application.status !== "PENDING") {
            return res.status(400).json({
                message: "Only pending applications can be rejected",
            });
        }
        const updated = await client_1.prisma.concessionApplication.update({
            where: { id: applicationId },
            data: {
                status: "REJECTED",
                rejectionReason: reason,
                approvedByStaffId: staffId,
                rejectedAt: new Date(),
            },
        });
        return res.json(updated);
    }
    catch (error) {
        console.error("Reject concession error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}
