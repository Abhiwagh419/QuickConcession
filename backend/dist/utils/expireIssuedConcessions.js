"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.expireIssuedConcessions = expireIssuedConcessions;
const client_1 = require("../prisma/client");
async function expireIssuedConcessions() {
    const now = new Date();
    const result = await client_1.prisma.concessionApplication.updateMany({
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
