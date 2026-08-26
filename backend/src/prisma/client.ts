import { PrismaClient } from "@prisma/client";

// A single shared Prisma client for the whole process. Previously this
// project instantiated TWO separate PrismaClients (this file, and the old
// src/prisma.ts) depending on which file a controller happened to import
// from. Each PrismaClient opens its own connection pool, so under real
// traffic that silently doubled the number of DB connections the app was
// holding open — and Postgres (especially free-tier hosted instances)
// has a hard cap on total connections. Once that cap was hit, every new
// request would start failing/timing out even though the app "looked"
// fine. Everything now points at this one instance.
//
// `declare global` + reuse-across-hot-reloads guards against
// ts-node-dev's --respawn creating a fresh client (and fresh pool) on
// every file change in dev.
declare global {
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined;
}

export const prisma = global.__prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  global.__prisma = prisma;
}
