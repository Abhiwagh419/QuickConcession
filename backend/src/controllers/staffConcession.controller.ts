import { Request, Response } from "express";
import { prisma } from "../prisma/client";
import { ApplicationStatus } from "@prisma/client";
import { calculateExpiryFromApproval } from "../utils/expiry";
import { sendMail } from "../utils/sendMail";

export async function getConcessionApplications(req: Request, res: Response) {
  try {
    const { status } = req.query;

    let statusFilter: ApplicationStatus | undefined;

    if (status) {
      if (
        !Object.values(ApplicationStatus).includes(status as ApplicationStatus)
      ) {
        return res.status(400).json({
          message: "Invalid application status",
        });
      }

      statusFilter = status as ApplicationStatus;
    }

    const applications = await prisma.concessionApplication.findMany({
      where: statusFilter
        ? statusFilter === "ISSUED"
          ? { status: { in: ["ISSUED", "EXPIRED"] } }
          : { status: statusFilter }
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
  res: Response,
) {
  try {
    const applicationId = Number(req.params.id);
    const staffId = req.user!.sub;
    const { concessionNumber } = req.body;

    if (isNaN(applicationId)) {
      return res.status(400).json({ message: "Invalid application id" });
    }

    const application = await prisma.concessionApplication.findUnique({
      where: { id: applicationId },
    });

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    if (application.status === "PENDING") {
      const approvedAt = new Date();
      const expiryDate = calculateExpiryFromApproval(
        approvedAt,
        application.duration,
      );

      const updated = await prisma.concessionApplication.update({
        where: { id: applicationId },
        data: {
          status: "APPROVED",
          approvedAt,
          expiryDate,
          approvedByStaffId: staffId,
        },
      });

      return res.json(updated);

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
      const expiryDate = calculateExpiryFromApproval(
        application.approvedAt!,
        application.duration,
      );

      const updated = await prisma.concessionApplication.update({
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
  } catch (error) {
    console.error("Approve / Issue concession error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function getConcessionApplicationById(
  req: Request,
  res: Response,
) {
  const applicationId = Number(req.params.id);

  if (isNaN(applicationId)) {
    return res.status(400).json({ message: "Invalid application id" });
  }

  const application = await prisma.concessionApplication.findUnique({
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

export async function rejectConcessionApplication(req: Request, res: Response) {
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
