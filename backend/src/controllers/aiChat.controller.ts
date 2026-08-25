import { Request, Response } from "express";
import { runAssistant, ChatMessage } from "../ai/groqClient";
import { ToolContext } from "../ai/tools";

export async function handleAiChat(req: any, res: Response) {
  const { messages } = req.body as { messages: ChatMessage[] };

  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ message: "messages array is required" });
  }

  if (messages.length > 20) {
    return res.status(400).json({ message: "Conversation too long" });
  }

  const role = req.user.role as ToolContext["role"];

  const context: ToolContext = {
    role,
    studentId: role === "STUDENT" ? req.user.id : undefined,
  };

  const reply = await runAssistant(messages, context);

  res.json({ reply });
}
