"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
// Kept only so existing `import { prisma } from "../prisma"` call sites
// keep working. This now just re-exports the single shared client from
// ./prisma/client instead of creating a second PrismaClient/connection
// pool (see that file for why that mattered).
var client_1 = require("./prisma/client");
Object.defineProperty(exports, "prisma", { enumerable: true, get: function () { return client_1.prisma; } });
