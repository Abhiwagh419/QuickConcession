import { Router } from "express";
import { requireAuth } from "../middleware/requireAuth";
import { aiChatLimiter } from "../middleware/rateLimit";
import { handleAiChat } from "../controllers/aiChat.controller";

const router = Router();

router.post("/chat", requireAuth, aiChatLimiter, handleAiChat);

export default router;
