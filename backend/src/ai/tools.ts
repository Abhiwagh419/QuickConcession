import { prisma } from "../prisma/client";
import { checkEligibility, EligibilityInput } from "./rulesEngine";
import { faqKnowledgeBase } from "./knowledgeBase";

export interface ToolContext {
  role: "STUDENT" | "STAFF" | "ADMIN";
  studentId?: number;
}

export const toolDefinitions = [
  {
    type: "function",
    function: {
      name: "check_eligibility",
      description:
        "Checks whether a student is eligible for a concession pass based on institution and year of study only. There is no category (General/OBC/SC/ST/etc.) requirement in this system — never ask the user for a category.",
      parameters: {
        type: "object",
        properties: {
          institution: { type: "string" },
          year: { type: "number" },
        },
        required: ["institution", "year"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_my_application_status",
      description:
        "Gets the current student's own concession application status, including rejection reason if rejected. Only usable by a logged-in student for their own data.",
      parameters: {
        type: "object",
        properties: {},
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_application_details",
      description:
        "Gets details and review flags for a specific application by ID. Only usable by staff/admin.",
      parameters: {
        type: "object",
        properties: {
          applicationId: { type: "number" },
        },
        required: ["applicationId"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "search_faq",
      description:
        "Searches the FAQ knowledge base for an answer to a general question about the concession process.",
      parameters: {
        type: "object",
        properties: {
          query: { type: "string" },
        },
        required: ["query"],
      },
    },
  },
];

async function toolCheckEligibility(args: EligibilityInput) {
  return checkEligibility(args);
}

async function toolGetMyApplicationStatus(context: ToolContext) {
  if (context.role !== "STUDENT" || !context.studentId) {
    return { error: "This tool is only available to logged-in students." };
  }

  const application = await prisma.concessionApplication.findFirst({
    where: { studentId: context.studentId },
    orderBy: { appliedAt: "desc" },
    select: {
      id: true,
      status: true,
      appliedAt: true,
      approvedAt: true,
      rejectedAt: true,
      rejectionReason: true,
      expiryDate: true,
      concessionNumber: true,
    },
  });

  if (!application) {
    return { found: false };
  }

  return { found: true, application };
}

async function toolGetApplicationDetails(
  args: { applicationId: number },
  context: ToolContext,
) {
  if (context.role !== "STAFF" && context.role !== "ADMIN") {
    return { error: "This tool is only available to staff/admin." };
  }

  const application = await prisma.concessionApplication.findUnique({
    where: { id: args.applicationId },
    select: {
      id: true,
      studentId: true,
      status: true,
      appliedAt: true,
      approvedAt: true,
      rejectedAt: true,
      rejectionReason: true,
      expiryDate: true,
      fromStation: true,
      toStation: true,
      travelClass: true,
      duration: true,
      student: {
        select: {
          fullName: true,
          enrollmentNo: true,
          course: true,
          year: true,
        },
      },
    },
  });

  if (!application) {
    return { found: false };
  }

  const priorCount = await prisma.concessionApplication.count({
    where: { studentId: application.studentId },
  });

  return {
    found: true,
    application,
    reviewFlags: {
      isExpiringSoon:
        !!application.expiryDate &&
        application.expiryDate.getTime() - Date.now() <
          7 * 24 * 60 * 60 * 1000,
      priorApplicationsOnRecord: priorCount,
    },
  };
}

async function toolSearchFaq(args: { query: string }) {
  const normalizedQuery = args.query.toLowerCase();

  const matches = faqKnowledgeBase.filter((entry) =>
    entry.keywords.some((keyword) => normalizedQuery.includes(keyword)),
  );

  if (matches.length === 0) {
    return { found: false };
  }

  return {
    found: true,
    results: matches.map((m) => ({ question: m.question, answer: m.answer })),
  };
}

export async function executeTool(
  name: string,
  args: any,
  context: ToolContext,
): Promise<unknown> {
  switch (name) {
    case "check_eligibility":
      return toolCheckEligibility(args);
    case "get_my_application_status":
      return toolGetMyApplicationStatus(context);
    case "get_application_details":
      return toolGetApplicationDetails(args, context);
    case "search_faq":
      return toolSearchFaq(args);
    default:
      return { error: `Unknown tool: ${name}` };
  }
}
