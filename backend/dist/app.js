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
const staffConcession_routes_2 = __importDefault(require("./routes/staffConcession.routes"));
const admin_routes_1 = __importDefault(require("./routes/admin.routes"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: [
        "http://localhost:5173",
        "http://localhost:8080",
        "https://quickconcession.onrender.com",
        "https://quick-concession.vercel.app",
        "https://quickconcession.online",
        "https://www.quickconcession.online", "https://quick-concession.vercel.app"
    ],
    credentials: true,
}));
app.use(express_1.default.json());
app.use((0, helmet_1.default)());
app.use("/auth", auth_routes_1.default);
app.use("/student", student_routes_1.default);
app.use("/concession", concession_routes_1.default);
(async () => {
    await (0, expireIssuedConcessions_1.expireIssuedConcessions)();
})();
(0, expireConcessions_1.startExpiryCron)();
app.use("/staff", staffAuth_routes_1.default);
app.use("/staff", staffConcession_routes_1.default);
app.use("/staff", staffConcession_routes_2.default);
app.use("/admin", admin_routes_1.default);
exports.default = app;
