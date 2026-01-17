import cron from "node-cron";
import { prisma } from "../prisma/client";

export function startExpiryCron() {

cron.schedule("5 0 * * *", async () => {

    console.log("[CRON] Expiry job triggered at", new Date().toISOString());

    try {
      const now = new Date();

      const result = await prisma.concessionApplication.updateMany({
        where: {
          status: "APPROVED",
          expiryDate: {
            not: null,
            lt: now,
          },
        },
        data: {
          status: "EXPIRED",
        },
      });

      console.log(
        `[CRON] Expired ${result.count} concession applications`
      );
    } catch (error) {
      console.error("[CRON] Expiry job failed:", error);
    }
  });
}
