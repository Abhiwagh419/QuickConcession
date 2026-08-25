"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startExpiryCron = startExpiryCron;
const node_cron_1 = __importDefault(require("node-cron"));
const client_1 = require("../prisma/client");
function startExpiryCron() {
    node_cron_1.default.schedule("5 0 * * *", async () => {
        console.log("[CRON] Expiry job triggered at", new Date().toISOString());
        try {
            const now = new Date();
            const result = await client_1.prisma.concessionApplication.updateMany({
                where: {
                    status: "ISSUED",
                    expiryDate: {
                        not: null,
                        lt: now,
                    },
                },
                data: {
                    status: "EXPIRED",
                },
            });
            console.log(`[CRON] Expired ${result.count} concession applications`);
        }
        catch (error) {
            console.error("[CRON] Expiry job failed:", error);
        }
    });
}
