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

  // This project doesn't use express-async-errors, so Express 4 won't
  // automatically forward a rejected promise from this async handler to
  // the global error middleware in app.ts — it would otherwise just hang
  // the request with no response at all. Catching explicitly here ensures
  // students always get a real response, even on a bug we didn't
  // anticipate (e.g. a database error inside a tool call). Kept as a 200
  // with a `reply` field (not a 500) to match the existing contract that
  // every other failure path in runAssistant already uses — the frontend
  // only reads `reply` on success responses.
  try {
    const reply = await runAssistant(messages, context);
    res.json({ reply });
  } catch (err) {
    console.error("Unhandled error in AI chat:", err);
    res.json({
      reply: "Sorry, the assistant is temporarily unavailable. Please try again shortly.",
    });
  }
}
