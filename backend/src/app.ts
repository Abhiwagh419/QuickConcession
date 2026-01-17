import express from "express";
import cors from "cors";
import helmet from "helmet";
import authRoutes from "./routes/auth.routes";
import { expireIssuedConcessions } from "./utils/expireIssuedConcessions";
import studentRoutes from "./routes/student.routes";
import concessionRoutes from "./routes/concession.routes";
import { startExpiryCron } from "./cron/expireConcessions";
import staffAuthRoutes from "./routes/staffAuth.routes";
import staffConcessionRoutes from "./routes/staffConcession.routes";
const app = express();

app.use(
    cors({
      origin: [
        "http://localhost:5173",
        "http://localhost:8080",
      ],
      credentials: true,
    })
  );
  
app.use(helmet());
app.use(express.json());
app.use("/auth", authRoutes);
app.use("/student", studentRoutes);
app.use("/concession", concessionRoutes);
(async () => {
  await expireIssuedConcessions();
})();
startExpiryCron();
app.use("/staff", staffAuthRoutes);
app.use("/staff", staffConcessionRoutes);

export default app;