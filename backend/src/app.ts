import express from "express";
import cors from "cors";
import helmet from "helmet";
import authRoutes from "./routes/auth.routes";

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

import studentRoutes from "./routes/student.routes";

app.use("/student", studentRoutes);

import concessionRoutes from "./routes/concession.routes";
app.use("/concession", concessionRoutes);

import { startExpiryCron } from "./cron/expireConcessions";

startExpiryCron();

import staffAuthRoutes from "./routes/staffAuth.routes";

app.use("/staff", staffAuthRoutes);

import staffConcessionRoutes from "./routes/staffConcession.routes";

app.use("/staff", staffConcessionRoutes);

export default app;