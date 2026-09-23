"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const expireIssuedConcessions_1 = require("./utils/expireIssuedConcessions");
const student_routes_1 = __importDefault(require("./routes/student.routes"));
const concession_routes_1 = __importDefault(require("./routes/concession.routes"));
const expireConcessions_1 = require("./cron/expireConcessions");
const staffAuth_routes_1 = __importDefault(require("./routes/staffAuth.routes"));
const staffConcession_routes_1 = __importDefault(require("./routes/staffConcession.routes"));
const admin_routes_1 = __importDefault(require("./routes/admin.routes"));
const aiChat_routes_1 = __importDefault(require("./routes/aiChat.routes"));
const rateLimit_1 = require("./middleware/rateLimit");
const app = (0, express_1.default)();
// Render/Vercel/most PaaS hosts sit behind a reverse proxy. Without this,
// Express sees every request as coming from the proxy's internal IP, which
// means express-rate-limit (and anything else keyed on req.ip) treats your
// ENTIRE class/college network as a single client — a handful of people
// could exhaust the shared bucket and lock everyone else out. This tells
// Express to trust the first hop's X-Forwarded-For header so req.ip is the
// real client IP.
app.set("trust proxy", 1);
app.use((0, cors_1.default)({
    origin: [
        "http://localhost:5173",
        "http://localhost:8080",
        "https://quickconcession.onrender.com",
        "https://quick-concession.vercel.app",
        "https://quickconcession.online",
        "https://www.quickconcession.online",
    ],
    credentials: true,
}));
app.use(express_1.default.json({ limit: "1mb" }));
app.use((0, helmet_1.default)());
// Lightweight endpoint for uptime checks / load balancer health probes so
// Render doesn't mistake a busy server for a dead one and restart it.
app.get("/health", (_req, res) => {
    res.status(200).json({ status: "ok" });
});
// Blanket safety-net limiter across every route, in addition to the
// stricter per-route limiters below. Protects against runaway frontend
// loops / scripted abuse without touching normal classroom usage.
app.use(rateLimit_1.generalLimiter);
app.use("/auth", auth_routes_1.default);
app.use("/student", student_routes_1.default);
app.use("/concession", concession_routes_1.default);
(0, expireIssuedConcessions_1.expireIssuedConcessions)().catch((err) => {
    console.error("Startup expiry sweep failed:", err);
});
(0, expireConcessions_1.startExpiryCron)();
app.use("/staff", staffAuth_routes_1.default);
app.use("/staff", staffConcession_routes_1.default);
app.use("/admin", admin_routes_1.default);
app.use("/ai", aiChat_routes_1.default);
app.use((req, res) => {
    res.status(404).json({ message: "Not found" });
});
app.use((err, req, res, _next) => {
    console.error("Unhandled error:", err);
    if (res.headersSent) {
        return;
    }
    res.status(500).json({ message: "Internal server error" });
});
exports.default = app;
