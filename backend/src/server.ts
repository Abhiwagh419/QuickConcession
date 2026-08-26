import "dotenv/config";
import app from "./app";
import { prisma } from "./prisma/client";

const PORT = process.env.PORT || 4000;

const server = app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});

// Under load it's normal for a stray promise somewhere (a missed .catch on
// a background task, a third-party SDK, etc.) to reject without being
// caught. By default that can crash the whole Node process and drop every
// in-flight request for every user. We log it instead of letting it take
// the server down — the alternative (silently going along) is worse than
// visibility, but killing the process on every unhandled rejection is
// what actually causes the "everyone gets kicked" experience we're
// trying to avoid here.
process.on("unhandledRejection", (reason) => {
  console.error("Unhandled promise rejection:", reason);
});

process.on("uncaughtException", (err) => {
  console.error("Uncaught exception:", err);
});

// Graceful shutdown: stop accepting new connections, let in-flight
// requests finish, then close the DB pool cleanly. Without this, a
// redeploy/restart during class (very likely) just hard-kills whatever
// requests are mid-flight and can leave Postgres connections dangling
// until they time out.
function shutdown(signal: string) {
  console.log(`${signal} received, shutting down gracefully...`);
  server.close(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });

  // Safety valve: if something hangs, don't let the process live forever.
  setTimeout(() => process.exit(1), 10_000).unref();
}

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));
