import cors from "cors";
import express from "express";
import helmet from "helmet";

import authRoutes from "./routes/auth.routes";
import studentRoutes from "./routes/student.routes";
import concessionRoutes from "./routes/concession.routes";
import staffAuthRoutes from "./routes/staffAuth.routes";
import staffConcessionRoutes from "./routes/staffConcession.routes";
import adminRoutes from "./routes/admin.routes";

import { expireIssuedConcessions } from "./utils/expireIssuedConcessions";
import { startExpiryCron } from "./cron/expireConcessions";

const app = express();

/* ============================= */
/*        CORS CONFIG            */
/* ============================= */

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:8080",
  "https://quick-concession.vercel.app",
  "https://quickconcession.online",
  "https://www.quickconcession.online",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (like mobile apps, curl)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Explicitly handle preflight
app.options("*", cors());

/* ============================= */
/*        MIDDLEWARE             */
/* ============================= */

app.use(express.json());
app.use(helmet());

/* ============================= */
/*           ROUTES              */
/* ============================= */

app.use("/auth", authRoutes);
app.use("/student", studentRoutes);
app.use("/concession", concessionRoutes);
app.use("/staff", staffAuthRoutes);
app.use("/staff", staffConcessionRoutes);
app.use("/admin", adminRoutes);

/* ============================= */
/*        CRON START             */
/* ============================= */

(async () => {
  await expireIssuedConcessions();
})();

startExpiryCron();

export default app;