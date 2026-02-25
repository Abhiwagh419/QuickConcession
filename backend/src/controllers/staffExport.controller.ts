import { Request, Response } from "express";
import { prisma } from "../prisma/client";
import ExcelJS from "exceljs";

function getDateRange(range?: string, from?: string, to?: string) {
  const now = new Date();

  if (from && to) {
    return {
      start: new Date(from),
      end: new Date(to),
    };
  }

  const start = new Date();

  switch (range) {
    case "1d":
      start.setDate(now.getDate() - 1);
      break;
    case "3d":
      start.setDate(now.getDate() - 3);
      break;
    case "1m":
      start.setMonth(now.getMonth() - 1);
      break;
    case "6m":
      start.setMonth(now.getMonth() - 6);
      break;
    default:
      start.setDate(now.getDate() - 1);
  }

  return { start, end: now };
}

function addMeta(
  sheet: ExcelJS.Worksheet,
  start: Date,
  end: Date,
  staffId: number,
) {
  sheet.insertRow(1, [
    `Exported By Staff ID: ${staffId} | Range: ${start.toLocaleDateString(
      "en-IN",
    )} to ${end.toLocaleDateString("en-IN")} | Generated: ${new Date().toLocaleString(
      "en-IN",
    )}`,
  ]);

  sheet.mergeCells("A1:N1");
  sheet.getRow(1).font = { bold: true };
}

export async function exportConcessionsExcel(req: Request, res: Response) {
  try {
    const { range, from, to } = req.query as {
      range?: string;
      from?: string;
      to?: string;
    };

    const { start, end } = getDateRange(range, from, to);
    const staffId = req.user!.sub;

const approved = await prisma.concessionApplication.findMany({
  where: {
    approvedByStaffId: staffId,
    status: { in: ["APPROVED", "ISSUED", "EXPIRED"] },
    approvedAt: {
  gte: start,
  lte: end,
},
  },
  include: {
    student: true,
  },
  orderBy: { approvedAt: "desc" },
});

const rejected = await prisma.concessionApplication.findMany({
  where: {
    approvedByStaffId: staffId,
    status: "REJECTED",
    rejectedAt: {
  gte: start,
  lte: end,
},
  },
  include: {
    student: true,
  },
  orderBy: { rejectedAt: "desc" },
});

    const workbook = new ExcelJS.Workbook();

    const approvedSheet = workbook.addWorksheet("Approved Concessions");

    approvedSheet.columns = [
      { header: "Enrollment No", key: "enrollmentNo", width: 18 },
      { header: "Student Name", key: "name", width: 22 },
      { header: "Course", key: "course", width: 15 },
      { header: "Semester", key: "sem", width: 10 },
      { header: "From", key: "from", width: 15 },
      { header: "To", key: "to", width: 15 },
      { header: "Class", key: "class", width: 12 },
      { header: "Duration", key: "duration", width: 12 },
      { header: "Concession No", key: "concession", width: 20 },
      { header: "Approved At", key: "date", width: 18 },
    ];
    approvedSheet.views = [{ state: "frozen", ySplit: 2 }];
    addMeta(approvedSheet, start, end, req.user!.sub);

    approved.forEach((a) => {
      approvedSheet.addRow({
        enrollmentNo: a.student.enrollmentNo,
        name: a.student.fullName,
        course: a.student.course,
        sem: a.student.sem,
        from: a.fromStation,
        to: a.toStation,
        class: a.travelClass,
        duration: a.duration,
        concession: a.concessionNumber ?? "-",
        date: a.approvedAt?.toLocaleDateString("en-IN"),
      });
    });

    approvedSheet.addRow({});
    approvedSheet.addRow({
      enrollmentNo: "TOTAL",
      name: approved.length,
    });

    const rejectedSheet = workbook.addWorksheet("Rejected Concessions");

    rejectedSheet.columns = [
      { header: "Enrollment No", key: "enrollmentNo", width: 18 },
      { header: "Student Name", key: "name", width: 22 },
      { header: "Course", key: "course", width: 15 },
      { header: "From", key: "from", width: 15 },
      { header: "To", key: "to", width: 15 },
      { header: "Rejected At", key: "date", width: 18 },
      { header: "Reason", key: "reason", width: 30 },
    ];

    rejectedSheet.views = [{ state: "frozen", ySplit: 2 }];
    addMeta(rejectedSheet, start, end, req.user!.sub);

    rejected.forEach((a) => {
      rejectedSheet.addRow({
        enrollmentNo: a.student.enrollmentNo,
        name: a.student.fullName,
        course: a.student.course,
        from: a.fromStation,
        to: a.toStation,
        date: a.rejectedAt?.toLocaleDateString("en-IN"),
        reason: a.rejectionReason ?? "-",
      });
    });

    rejectedSheet.addRow({});
    rejectedSheet.addRow({
      enrollmentNo: "TOTAL",
      name: rejected.length,
    });

    res.setHeader(
      "Content-Disposition",
      "attachment; filename=concessions-export.xlsx",
    );
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    );

    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    console.error("Export excel error:", err);
    res.status(500).json({ message: "Failed to export data" });
  }
}
