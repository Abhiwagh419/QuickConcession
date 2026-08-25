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
import staffRoutes from "./routes/staffConcession.routes";
import adminRoutes from "./routes/admin.routes";
import aiChatRoutes from "./routes/aiChat.routes";

const app = express();

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

app.use(express.json());
app.use(helmet());
app.use("/auth", authRoutes);
app.use("/student", studentRoutes);
app.use("/concession", concessionRoutes);
(async () => {
  await expireIssuedConcessions();
})();
startExpiryCron();
app.use("/staff", staffAuthRoutes);
app.use("/staff", staffConcessionRoutes);
app.use("/staff", staffRoutes);
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
