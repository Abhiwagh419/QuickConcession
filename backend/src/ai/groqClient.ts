import { executeTool, toolDefinitions, ToolContext } from "./tools";

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_MODEL = "llama-3.3-70b-versatile";
const MAX_TOOL_ROUNDS = 3;

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

function buildSystemPrompt(context: ToolContext): string {
  const base =
    "You are the QuickConcession assistant, helping with a college railway concession portal. " +
    "You must never answer a factual question about eligibility, application status, or FAQ content " +
    "from your own knowledge. Always call the relevant tool first and base your answer only on what " +
    "the tool returns. If a tool returns an error or no result, say you don't have that information " +
    "rather than guessing. If the user asks for something no available tool covers, say plainly that " +
    "you don't currently support that, in plain text, without attempting to call a tool that isn't in " +
    "your tool list. Keep answers short and plain.";

  if (context.role === "STUDENT") {
    return `${base} The current user is a student. They can ask about their own application status, general FAQs, and eligibility.`;
  }

  return `${base} The current user is staff/admin. They can ask about a specific application by ID for review support. You are not authorized to approve or reject anything — only provide information to help the human reviewer decide.`;
}

async function callGroq(apiKey: string, messages: any[], useTools: boolean) {
  const body: any = { model: GROQ_MODEL, messages };

  if (useTools) {
    body.tools = toolDefinitions;
    body.tool_choice = "auto";
  }

  const response = await fetch(GROQ_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  return response;
}

export async function runAssistant(
  history: ChatMessage[],
  context: ToolContext,
): Promise<string> {
  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    return "The AI assistant isn't configured yet. Please contact the site admin.";
  }

  const messages: any[] = [
    { role: "system", content: buildSystemPrompt(context) },
    ...history,
  ];

  for (let round = 0; round < MAX_TOOL_ROUNDS; round++) {
    const response = await callGroq(apiKey, messages, true);

    if (!response.ok) {
      const errorBody = await response.text().catch(() => "");
      console.error("Groq API error:", response.status, errorBody);

      if (errorBody.includes("tool_use_failed")) {
        const fallback = await callGroq(apiKey, messages, false);

        if (fallback.ok) {
          const fallbackData = await fallback.json();
          const fallbackContent = fallbackData.choices?.[0]?.message?.content;

          if (fallbackContent) {
            return fallbackContent;
          }
        }
      }

      return "Sorry, the assistant is temporarily unavailable. Please try again shortly.";
    }

    const data = await response.json();
    const choice = data.choices?.[0]?.message;

    if (!choice) {
      return "Sorry, I couldn't process that. Please try again.";
    }

    if (!choice.tool_calls || choice.tool_calls.length === 0) {
      return choice.content ?? "Sorry, I couldn't process that.";
    }

    messages.push(choice);

    for (const toolCall of choice.tool_calls) {
      let args: any = {};
      try {
        args = JSON.parse(toolCall.function.arguments || "{}");
      } catch {
        args = {};
      }

      const result = await executeTool(
        toolCall.function.name,
        args,
        context,
      );

      messages.push({
        role: "tool",
        tool_call_id: toolCall.id,
        content: JSON.stringify(result),
      });
    }
  }

  return "Sorry, that took too many steps to resolve. Please rephrase your question.";
}
