import cors from "cors";
import express, { NextFunction, Request, Response } from "express";
import helmet from "helmet";
import authRoutes from "./routes/auth.routes";
import { expireIssuedConcessions } from "./utils/expireIssuedConcessions";
import studentRoutes from "./routes/student.routes";
import concessionRoutes from "./routes/concession.routes";
import { startExpiryCron } from "./cron/expireConcessions";
import staffAuthRoutes from "./routes/staffAuth.routes";
import staffConcessionRoutes from "./routes/staffConcession.routes";
import adminRoutes from "./routes/admin.routes";
import aiChatRoutes from "./routes/aiChat.routes";
import { generalLimiter } from "./middleware/rateLimit";

const app = express();

// Render/Vercel/most PaaS hosts sit behind a reverse proxy. Without this,
// Express sees every request as coming from the proxy's internal IP, which
// means express-rate-limit (and anything else keyed on req.ip) treats your
// ENTIRE class/college network as a single client — a handful of people
// could exhaust the shared bucket and lock everyone else out. This tells
// Express to trust the first hop's X-Forwarded-For header so req.ip is the
// real client IP.
app.set("trust proxy", 1);

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:8080",
      "https://quickconcession.onrender.com",
      "https://quick-concession.vercel.app",
      "https://quickconcession.online",
      "https://www.quickconcession.online",
    ],
    credentials: true,
  }),
);

app.use(express.json({ limit: "1mb" }));
app.use(helmet());

// Lightweight endpoint for uptime checks / load balancer health probes so
// Render doesn't mistake a busy server for a dead one and restart it.
app.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({ status: "ok" });
});

// Blanket safety-net limiter across every route, in addition to the
// stricter per-route limiters below. Protects against runaway frontend
// loops / scripted abuse without touching normal classroom usage.
app.use(generalLimiter);

app.use("/auth", authRoutes);
app.use("/student", studentRoutes);
app.use("/concession", concessionRoutes);

expireIssuedConcessions().catch((err) => {
  console.error("Startup expiry sweep failed:", err);
});
startExpiryCron();

app.use("/staff", staffAuthRoutes);
app.use("/staff", staffConcessionRoutes);
app.use("/admin", adminRoutes);
app.use("/ai", aiChatRoutes);

app.use((req: Request, res: Response) => {
  res.status(404).json({ message: "Not found" });
});

app.use((err: unknown, req: Request, res: Response, _next: NextFunction) => {
  console.error("Unhandled error:", err);

  if (res.headersSent) {
    return;
  }

  res.status(500).json({ message: "Internal server error" });
});

export default app;
