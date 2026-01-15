import cron from "node-cron";
import { prisma } from "../prisma";

const getExpiryDate = (start: Date, duration: string) => {
  const d = new Date(start);
  if (duration === "Quarterly") d.setMonth(d.getMonth() + 3);
  if (duration === "Half-Yearly") d.setMonth(d.getMonth() + 6);
  if (duration === "Yearly") d.setFullYear(d.getFullYear() + 1);
  return d;
};

export const startConcessionExpiryCron = () => {
  // Runs every day at 00:05 AM
  cron.schedule("5 0 * * *", async () => {
    console.log("⏰ Running concession expiry job");

    const approved = await prisma.concessionApplication.findMany({
      where: { status: "APPROVED" },
    });

    const now = new Date();

    for (const app of approved) {
      const expiry = getExpiryDate(app.startDate, app.duration);

      if (expiry < now) {
        await prisma.concessionApplication.update({
          where: { id: app.id },
          data: { status: "EXPIRED" },
        });
      }
    }

    console.log("Concession expiry check complete");
  });
};
