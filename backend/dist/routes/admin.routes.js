"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_1 = require("../prisma/client");
const requireAuth_1 = require("../middleware/requireAuth");
const bcrypt_1 = __importDefault(require("bcrypt"));
const staffConcession_controller_1 = require("../controllers/staffConcession.controller");
const upload_1 = require("../middleware/upload");
const sync_1 = require("csv-parse/sync");
const client_2 = require("@prisma/client");
const adminExport_controller_1 = require("../controllers/adminExport.controller");
const validate_1 = require("../utils/validate");
const router = (0, express_1.Router)();

function ensureAdmin(req, res) {
    if (!req.user || req.user.role !== "ADMIN") {
        res.status(403).json({ message: "Forbidden" });
        return false;
    }
    return true;
}

router.get("/students", requireAuth_1.requireAuth, async (req, res) => {
    if (!ensureAdmin(req, res))
        return;
    const showDeleted = req.query.deleted === "true";
    const students = await client_1.prisma.student.findMany({
        where: { isDeleted: showDeleted },
        orderBy: { id: "asc" },
        select: {
            id: true,
            enrollmentNo: true,
            fullName: true,
            email: true,
            course: true,
            year: true,
            sem: true,
            shift: true,
            active: true,
            createdAt: true,
        },
    });
    res.json(students);
});

router.post("/students", requireAuth_1.requireAuth, async (req, res) => {
    if (!ensureAdmin(req, res))
        return;
    const { enrollmentNo, fullName, email, mobileNumber, course, year, sem, shift, password, dateOfBirth, address, } = req.body;
    if (!enrollmentNo || !fullName || !email || !password) {
        return res.status(400).json({ message: "Missing required fields" });
    }
    if (!(0, validate_1.isValidEmail)(email)) {
        return res.status(400).json({ message: "Invalid email address" });
    }
    if (!(0, validate_1.isValidPassword)(password)) {
        return res
            .status(400)
            .json({ message: "Password must be at least 6 characters" });
    }
    const existing = await client_1.prisma.student.findFirst({
        where: { OR: [{ enrollmentNo }, { email }] },
    });
    if (existing) {
        return res
            .status(400)
            .json({ message: "Enrollment number or email already exists" });
    }
    const passwordHash = await bcrypt_1.default.hash(password, 12);
    const student = await client_1.prisma.student.create({
        data: {
            enrollmentNo,
            fullName,
            email,
            mobileNumber,
            course,
            year,
            sem,
            shift,
            passwordHash,
            dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
            address,
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
            active: true,
            isDeleted: true,
            createdAt: true,
        },
    });
    res.status(201).json(student);
});

router.patch("/students/:id/toggle", requireAuth_1.requireAuth, async (req, res) => {
    if (!ensureAdmin(req, res))
        return;
    const studentId = Number(req.params.id);
    const student = await client_1.prisma.student.findUnique({
        where: { id: studentId },
    });
    if (!student) {
        return res.status(404).json({ message: "Student not found" });
    }
    const updated = await client_1.prisma.student.update({
        where: { id: studentId },
        data: { active: !student.active },
    });
    res.json({
        message: "Student status updated",
        active: updated.active,
    });
});

router.patch("/students/:id/delete", requireAuth_1.requireAuth, async (req, res) => {
    if (!ensureAdmin(req, res))
        return;
    const studentId = Number(req.params.id);
    await client_1.prisma.student.update({
        where: { id: studentId },
        data: { isDeleted: true },
    });
    res.json({ message: "Student deleted successfully" });
});

router.patch("/students/:id/restore", requireAuth_1.requireAuth, async (req, res) => {
    if (!ensureAdmin(req, res))
        return;
    const studentId = Number(req.params.id);
    const student = await client_1.prisma.student.findUnique({
        where: { id: studentId },
    });
    if (!student) {
        return res.status(404).json({ message: "Student not found" });
    }
    await client_1.prisma.student.update({
        where: { id: studentId },
        data: { isDeleted: false },
    });
    res.json({ message: "Student restored successfully" });
});

router.post("/students/:id/reset-password", requireAuth_1.requireAuth, async (req, res) => {
    if (!ensureAdmin(req, res))
        return;
    const studentId = Number(req.params.id);
    const { newPassword } = req.body;
    if (!newPassword || newPassword.length < 6) {
        return res
            .status(400)
            .json({ message: "Password must be at least 6 characters" });
    }
    const student = await client_1.prisma.student.findUnique({
        where: { id: studentId },
    });
    if (!student) {
        return res.status(404).json({ message: "Student not found" });
    }
    const passwordHash = await bcrypt_1.default.hash(newPassword, 12);
    await client_1.prisma.student.update({
        where: { id: studentId },
        data: { passwordHash },
    });
    res.json({ message: "Password updated successfully" });
});

router.patch("/students/:id", requireAuth_1.requireAuth, async (req, res) => {
    if (!ensureAdmin(req, res))
        return;
    const studentId = Number(req.params.id);
    const { fullName, email, mobileNumber, course, year, sem, shift, address, dateOfBirth, } = req.body;
    const updated = await client_1.prisma.student.update({
        where: { id: studentId },
        data: {
            fullName,
            email,
            mobileNumber,
            course,
            year,
            sem,
            shift,
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
            address: true,
            dateOfBirth: true,
            active: true,
            isDeleted: true,
        },
    });
    res.json(updated);
});

router.get("/students/:id", requireAuth_1.requireAuth, async (req, res) => {
    if (!ensureAdmin(req, res))
        return;
    const studentId = Number(req.params.id);
    const student = await client_1.prisma.student.findUnique({
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
            address: true,
            dateOfBirth: true,
        },
    });
    if (!student) {
        return res.status(404).json({ message: "Student not found" });
    }
    res.json(student);
});
router.get("/students/:id/full", requireAuth_1.requireAuth, async (req, res) => {
    if (!ensureAdmin(req, res))
        return;
    const studentId = Number(req.params.id);
    const student = await client_1.prisma.student.findUnique({
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
            address: true,
            dateOfBirth: true,
            active: true,
            isDeleted: true,
            createdAt: true,
            applications: {
                orderBy: { appliedAt: "desc" },
            },
        },
    });
    if (!student) {
        return res.status(404).json({ message: "Student not found" });
    }
    const total = student.applications.length;
    const approved = student.applications.filter((a) => a.status === "APPROVED").length;
    const rejected = student.applications.filter((a) => a.status === "REJECTED").length;
    const issued = student.applications.filter((a) => a.status === "ISSUED" || a.status === "EXPIRED").length;
    const pending = student.applications.filter((a) => a.status === "PENDING").length;
    const approvalRate = total === 0 ? 0 : Math.round(((approved + issued) / total) * 100);
    res.json({
        ...student,
        analytics: {
            total,
            approved,
            rejected,
            issued,
            pending,
            approvalRate,
        },
    });
});
router.get("/applications/:id", requireAuth_1.requireAuth, async (req, res) => {
    if (!ensureAdmin(req, res))
        return;
    const id = Number(req.params.id);
    const application = await client_1.prisma.concessionApplication.findUnique({
        where: { id },
        include: {
            student: true,
            approvedBy: true,
        },
    });
    if (!application) {
        return res.status(404).json({ message: "Application not found" });
    }
    res.json(application);
});
router.post("/applications/:id/approve", requireAuth_1.requireAuth, async (req, res) => {
    if (!ensureAdmin(req, res))
        return;
    return (0, staffConcession_controller_1.approveConcessionApplication)(req, res);
});
router.post("/applications/:id/reject", requireAuth_1.requireAuth, async (req, res) => {
    if (!ensureAdmin(req, res))
        return;
    return (0, staffConcession_controller_1.rejectConcessionApplication)(req, res);
});
router.get("/dashboard", requireAuth_1.requireAuth, async (req, res) => {
    if (!ensureAdmin(req, res))
        return;
    try {
        const totalStudents = await client_1.prisma.student.count({
            where: { isDeleted: false },
        });
        const totalStaff = await client_1.prisma.staff.count();
        const totalApplications = await client_1.prisma.concessionApplication.count();
        const grouped = await client_1.prisma.concessionApplication.groupBy({
            by: ["status"],
            _count: true,
        });
        let pendingApplications = 0;
        let rejectedApplications = 0;
        let approvedApplications = 0;
        grouped.forEach((g) => {
            if (g.status === "PENDING")
                pendingApplications = g._count;
            if (g.status === "REJECTED")
                rejectedApplications = g._count;
            if (g.status === "APPROVED" ||
                g.status === "ISSUED" ||
                g.status === "EXPIRED") {
                approvedApplications += g._count;
            }
        });
        res.json({
            totalStudents,
            totalStaff,
            totalApplications,
            pendingApplications,
            approvedApplications,
            rejectedApplications,
        });
    }
    catch (error) {
        console.error("Admin dashboard error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
router.get("/staff", requireAuth_1.requireAuth, async (req, res) => {
    if (!ensureAdmin(req, res))
        return;
    const showDeleted = req.query.deleted === "true";
    const staff = await client_1.prisma.staff.findMany({
        where: {
            role: client_2.UserRole.STAFF,
            isDeleted: showDeleted,
        },
        orderBy: { id: "asc" },
        select: {
            id: true,
            fullName: true,
            email: true,
            role: true,
            createdAt: true,
            active: true,
            isDeleted: true,
        },
    });
    res.json(staff);
});
router.patch("/staff/:id", requireAuth_1.requireAuth, async (req, res) => {
    if (!ensureAdmin(req, res))
        return;
    const id = Number(req.params.id);
    const { fullName, email } = req.body;
    const updated = await client_1.prisma.staff.update({
        where: { id },
        data: { fullName, email },
        select: {
            id: true,
            fullName: true,
            email: true,
            role: true,
            createdAt: true,
            active: true,
            isDeleted: true,
        },
    });
    res.json(updated);
});
router.patch("/staff/:id/toggle", requireAuth_1.requireAuth, async (req, res) => {
    if (!ensureAdmin(req, res))
        return;
    const id = Number(req.params.id);
    const staff = await client_1.prisma.staff.findUnique({
        where: { id },
    });
    if (!staff) {
        return res.status(404).json({ message: "Staff not found" });
    }
    const updated = await client_1.prisma.staff.update({
        where: { id },
        data: { active: !staff.active },
        select: {
            id: true,
            fullName: true,
            email: true,
            role: true,
            createdAt: true,
            active: true,
            isDeleted: true,
        },
    });
    res.json(updated);
});
router.patch("/staff/:id/delete", requireAuth_1.requireAuth, async (req, res) => {
    if (!ensureAdmin(req, res))
        return;
    const id = Number(req.params.id);
    await client_1.prisma.staff.update({
        where: { id },
        data: { isDeleted: true },
    });
    res.json({ message: "Staff deleted successfully" });
});
router.patch("/staff/:id/restore", requireAuth_1.requireAuth, async (req, res) => {
    if (!ensureAdmin(req, res))
        return;
    const id = Number(req.params.id);
    await client_1.prisma.staff.update({
        where: { id },
        data: { isDeleted: false },
    });
    res.json({ message: "Staff restored successfully" });
});
router.post("/staff/:id/reset-password", requireAuth_1.requireAuth, async (req, res) => {
    if (!ensureAdmin(req, res))
        return;
    const id = Number(req.params.id);
    const { newPassword } = req.body;
    if (!newPassword || newPassword.length < 6) {
        return res
            .status(400)
            .json({ message: "Password must be at least 6 characters" });
    }
    const passwordHash = await bcrypt_1.default.hash(newPassword, 12);
    await client_1.prisma.staff.update({
        where: { id },
        data: { passwordHash },
    });
    res.json({ message: "Password updated successfully" });
});
router.post("/staff/bulk/preview", requireAuth_1.requireAuth, upload_1.upload.single("file"), async (req, res) => {
    if (!ensureAdmin(req, res))
        return;
    if (!req.file) {
        return res.status(400).json({ message: "CSV file required" });
    }
    const csvString = req.file.buffer.toString();
    const records = (0, sync_1.parse)(csvString, {
        columns: true,
        skip_empty_lines: true,
        trim: true,
    });
    const validStaff = [];
    const errors = [];
    const existingStaff = await client_1.prisma.staff.findMany({
        select: { email: true },
    });
    const emailSet = new Set(existingStaff.map((s) => s.email));
    for (let i = 0; i < records.length; i++) {
        const row = records[i];
        const rowNumber = i + 2;
        if (!row.fullName || !row.email || !row.password) {
            errors.push({
                row: rowNumber,
                data: row,
                reason: "Missing required fields",
            });
            continue;
        }
        if (emailSet.has(row.email)) {
            errors.push({
                row: rowNumber,
                data: row,
                reason: "Duplicate email in DB",
            });
            continue;
        }
        validStaff.push(row);
    }
    res.json({
        totalRows: records.length,
        validCount: validStaff.length,
        invalidCount: errors.length,
        validStaff,
        errors,
    });
});
router.post("/staff/bulk/confirm", requireAuth_1.requireAuth, async (req, res) => {
    if (!ensureAdmin(req, res))
        return;
    const { staff } = req.body;
    if (!Array.isArray(staff)) {
        return res.status(400).json({ message: "Invalid payload" });
    }
    const finalData = [];
    for (const s of staff) {
        const passwordHash = await bcrypt_1.default.hash(s.password, 12);
        finalData.push({
            fullName: s.fullName,
            email: s.email,
            passwordHash,
            role: client_2.UserRole.STAFF,
        });
    }
    const result = await client_1.prisma.staff.createMany({
        data: finalData,
        skipDuplicates: true,
    });
    res.json({
        message: "Staff imported successfully",
        inserted: result.count,
    });
});
router.get("/export/excel", requireAuth_1.requireAuth, async (req, res) => {
    if (!ensureAdmin(req, res))
        return;
    return (0, adminExport_controller_1.exportAdminExcel)(req, res);
});
router.post("/students/bulk/preview", requireAuth_1.requireAuth, upload_1.upload.single("file"), async (req, res) => {
    if (!ensureAdmin(req, res))
        return;
    if (!req.file) {
        return res.status(400).json({ message: "CSV file required" });
    }
    const csvString = req.file.buffer.toString();
    const records = (0, sync_1.parse)(csvString, {
        columns: true,
        skip_empty_lines: true,
        trim: true,
    });
    const validStudents = [];
    const errors = [];
    const existingStudents = await client_1.prisma.student.findMany({
        select: { enrollmentNo: true, email: true },
    });
    const enrollmentSet = new Set(existingStudents.map((s) => s.enrollmentNo));
    const emailSet = new Set(existingStudents.map((s) => s.email));
    const validYears = ["FY", "SY", "TY"];
    const validSems = [
        "SEM_I",
        "SEM_II",
        "SEM_III",
        "SEM_IV",
        "SEM_V",
        "SEM_VI",
    ];
    const validShifts = ["FIRST", "SECOND"];
    for (let i = 0; i < records.length; i++) {
        const row = records[i];
        const rowNumber = i + 2;
        if (!row.enrollmentNo || !row.fullName || !row.email || !row.password) {
            errors.push({
                row: rowNumber,
                data: row,
                reason: "Missing required fields",
            });
            continue;
        }
        if (enrollmentSet.has(row.enrollmentNo)) {
            errors.push({
                row: rowNumber,
                data: row,
                reason: "Duplicate enrollment number in DB",
            });
            continue;
        }
        if (emailSet.has(row.email)) {
            errors.push({
                row: rowNumber,
                data: row,
                reason: "Duplicate email in DB",
            });
            continue;
        }
        if (!validYears.includes(row.year)) {
            errors.push({
                row: rowNumber,
                data: row,
                reason: "Invalid Year",
            });
            continue;
        }
        if (!validSems.includes(row.sem)) {
            errors.push({
                row: rowNumber,
                data: row,
                reason: "Invalid Semester",
            });
            continue;
        }
        if (!validShifts.includes(row.shift)) {
            errors.push({
                row: rowNumber,
                data: row,
                reason: "Invalid Shift",
            });
            continue;
        }
        validStudents.push(row);
    }
    res.json({
        totalRows: records.length,
        validCount: validStudents.length,
        invalidCount: errors.length,
        validStudents,
        errors,
    });
});
router.post("/students/bulk/confirm", requireAuth_1.requireAuth, async (req, res) => {
    if (!ensureAdmin(req, res))
        return;
    const { students } = req.body;
    if (!Array.isArray(students)) {
        return res.status(400).json({ message: "Invalid payload" });
    }
    const finalData = [];
    for (const s of students) {
        const passwordHash = await bcrypt_1.default.hash(s.password, 12);
        finalData.push({
            enrollmentNo: s.enrollmentNo,
            fullName: s.fullName,
            email: s.email,
            mobileNumber: s.mobileNumber,
            course: s.course,
            year: s.year,
            sem: s.sem,
            shift: s.shift,
            passwordHash,
            dateOfBirth: s.dateOfBirth && !isNaN(new Date(s.dateOfBirth).getTime())
                ? new Date(s.dateOfBirth)
                : null,
            address: s.address,
        });
    }
    const result = await client_1.prisma.student.createMany({
        data: finalData,
        skipDuplicates: true,
    });
    res.json({
        message: "Students imported successfully",
        inserted: result.count,
    });
});

router.get("/staff/:id", requireAuth_1.requireAuth, async (req, res) => {
    if (!ensureAdmin(req, res))
        return;
    const id = Number(req.params.id);
    const staff = await client_1.prisma.staff.findUnique({
        where: { id },
        select: {
            id: true,
            fullName: true,
            email: true,
            role: true,
            createdAt: true,
            active: true,
            isDeleted: true,
            _count: {
                select: { approvedApplications: true },
            },
        },
    });
    if (!staff) {
        return res.status(404).json({ message: "Staff not found" });
    }
    res.json(staff);
});
router.get("/applications", requireAuth_1.requireAuth, async (req, res) => {
    if (!ensureAdmin(req, res))
        return;
    try {
        const applications = await client_1.prisma.concessionApplication.findMany({
            orderBy: { appliedAt: "desc" },
            include: {
                student: {
                    select: {
                        id: true,
                        fullName: true,
                        enrollmentNo: true,
                        email: true,
                        mobileNumber: true,
                        course: true,
                        year: true,
                        sem: true,
                        shift: true,
                    },
                },
            },
        });
        res.json(applications);
    }
    catch (error) {
        console.error("Admin applications fetch error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.post("/staff", requireAuth_1.requireAuth, async (req, res) => {
    if (!ensureAdmin(req, res))
        return;
    const { fullName, email, password } = req.body;
    if (!fullName || !email || !password) {
        return res.status(400).json({
            message: "Missing required fields",
        });
    }
    if (!(0, validate_1.isValidEmail)(email)) {
        return res.status(400).json({ message: "Invalid email address" });
    }
    if (!(0, validate_1.isValidPassword)(password)) {
        return res
            .status(400)
            .json({ message: "Password must be at least 6 characters" });
    }
    const existing = await client_1.prisma.staff.findUnique({
        where: { email },
    });
    if (existing) {
        return res.status(400).json({
            message: "Staff email already exists",
        });
    }
    const passwordHash = await bcrypt_1.default.hash(password, 12);
    const staff = await client_1.prisma.staff.create({
        data: {
            fullName,
            email,
            passwordHash,
            role: client_2.UserRole.STAFF,
        },
        select: {
            id: true,
            fullName: true,
            email: true,
            role: true,
            createdAt: true,
            active: true,
            isDeleted: true,
        },
    });
    res.status(201).json(staff);
});
exports.default = router;
