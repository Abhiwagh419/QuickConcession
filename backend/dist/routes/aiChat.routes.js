"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const requireAuth_1 = require("../middleware/requireAuth");
const rateLimit_1 = require("../middleware/rateLimit");
const aiChat_controller_1 = require("../controllers/aiChat.controller");
const router = (0, express_1.Router)();
router.post("/chat", requireAuth_1.requireAuth, rateLimit_1.aiChatLimiter, aiChat_controller_1.handleAiChat);
exports.default = router;
