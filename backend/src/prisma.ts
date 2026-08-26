// Kept only so existing `import { prisma } from "../prisma"` call sites
// keep working. This now just re-exports the single shared client from
// ./prisma/client instead of creating a second PrismaClient/connection
// pool (see that file for why that mattered).
export { prisma } from "./prisma/client";
