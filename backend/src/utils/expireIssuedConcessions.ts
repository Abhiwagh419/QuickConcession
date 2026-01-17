import { prisma } from "../prisma/client";

export async function expireIssuedConcessions() {
  const now = new Date();

  const result = await prisma.concessionApplication.updateMany({
    where: {
      status: "ISSUED",
      expiryDate: {
        lt: now,
      },
    },
    data: {
      status: "EXPIRED",
    },
  });

  if (result.count > 0) {
    console.log(`⏰ ${result.count} concession(s) expired`);
  }
}
