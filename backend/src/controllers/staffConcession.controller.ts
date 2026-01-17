import { Request, Response } from "express";
import { prisma } from "../prisma/client";
import { ApplicationStatus } from "@prisma/client";
import { calculateExpiryFromApproval } from "../utils/expiry";
export async function getConcessionApplications(
  req: Request,
  res: Response
) {
  try {
    const { status } = req.query;

    let statusFilter: ApplicationStatus | undefined;

    if (status) {
      if (
        !Object.values(ApplicationStatus).includes(
          status as ApplicationStatus
        )
      ) {
        return res.status(400).json({
          message: "Invalid application status",
        });
      }

      statusFilter = status as ApplicationStatus;
    }

    const applications = await prisma.concessionApplication.findMany({
      where: statusFilter
        ? { status: statusFilter }
        : undefined,
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

    return res.json(applications);
  } catch (error) {
    console.error("Fetch staff concessions error:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

export async function approveConcessionApplication(
  req: Request,
  res: Response
) { 
  try {
    const applicationId = Number(req.params.id);
    const staffId = req.user!.sub;
    const { concessionNumber } = req.body; // ✅ ADD

    if (isNaN(applicationId)) {
      return res.status(400).json({ message: "Invalid application id" });
    }
    if (!concessionNumber || typeof concessionNumber !== "string") {
  return res.status(400).json({
    message: "Concession number is required for approval",
  });
}

    const application = await prisma.concessionApplication.findUnique({
      where: { id: applicationId },
    });

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    if (application.status !== "PENDING") {
      return res.status(400).json({
        message: "Only pending applications can be approved",
      });
    }

    const approvedAt = new Date();
const expiryDate = calculateExpiryFromApproval(
  approvedAt,
  application.duration
);

const updated = await prisma.concessionApplication.update({
  where: { id: applicationId },
  data: {
    status: "APPROVED",
    approvedAt,
    expiryDate,
    approvedByStaffId: staffId,
    concessionNumber, 
  },
});

    return res.json(updated);
  } catch (error) {
    console.error("Approve concession error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function rejectConcessionApplication(
  req: Request,
  res: Response
) {
  try {
    const applicationId = Number(req.params.id);
    const staffId = req.user!.sub;
    const { reason } = req.body;

    if (isNaN(applicationId)) {
      return res.status(400).json({ message: "Invalid application id" });
    }

    if (!reason || typeof reason !== "string") {
      return res.status(400).json({
        message: "Rejection reason is required",
      });
    }

    const application = await prisma.concessionApplication.findUnique({
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

    const updated = await prisma.concessionApplication.update({
      where: { id: applicationId },
      data: {
        status: "REJECTED",
        rejectionReason: reason,
        approvedByStaffId: staffId,
      },
    });

    return res.json(updated);
  } catch (error) {
    console.error("Reject concession error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

