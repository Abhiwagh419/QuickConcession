import cors from "cors";
import express from "express";
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

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:8080",
      "https://quickconcession.onrender.com",
      "https://your-frontend-domain.vercel.app"
    ],
    credentials: true,
  })
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

export default app;
