import { executeTool, toolDefinitions, ToolContext } from "./tools";

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_MODEL = "openai/gpt-oss-20b";
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
    "your tool list. Keep answers short, warm, and in plain everyday language — avoid jargon. " +
    "Eligibility in this system is based only on being an actively enrolled student here, with no " +
    "separate category (General/OBC/SC/ST/EWS/etc.) requirement — never ask the user for a category " +
    "or treat one as relevant, even if they mention it.";

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

  // fetch() can throw (network blip, DNS failure, timeout) rather than
  // resolving with a non-ok response. Without this try/catch, that throw
  // becomes an unhandled rejection in the (unwrapped, plain-async) route
  // handler — the request just hangs until the client times out, with no
  // error shown to the student at all. Returning null lets the caller
  // treat "couldn't reach Groq" the same way as "Groq returned an error".
  try {
    return await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
  } catch (networkError) {
    console.error("Groq request failed (network):", networkError);
    return null;
  }
}

function extractLastUserMessage(history: ChatMessage[]): string | undefined {
  for (let i = history.length - 1; i >= 0; i--) {
    if (history[i].role === "user") {
      return history[i].content;
    }
  }
  return undefined;
}

// When Groq is unreachable, rate-limited, or otherwise erroring, this tries
// a local (no-LLM) FAQ keyword match on the student's last message instead
// of just failing outright. FAQ search is plain string matching in
// knowledgeBase.ts — it has no dependency on Groq being up at all.
async function tryLocalFaqFallback(
  history: ChatMessage[],
  context: ToolContext,
): Promise<string | null> {
  const query = extractLastUserMessage(history);
  if (!query) return null;

  const result: any = await executeTool("search_faq", { query }, context);

  if (result?.found && result.results?.[0]) {
    const { question, answer } = result.results[0];
    return `I couldn't reach the full assistant right now, but here's a related FAQ answer:\n\n**${question}**\n${answer}`;
  }

  return null;
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

    if (!response || !response.ok) {
      const status = response?.status;
      const errorBody = response ? await response.text().catch(() => "") : "";

      if (response) {
        console.error("Groq API error:", status, errorBody);
      }

      if (errorBody.includes("tool_use_failed")) {
        const fallback = await callGroq(apiKey, messages, false);

        if (fallback?.ok) {
          const fallbackData = await fallback.json();
          const fallbackContent = fallbackData.choices?.[0]?.message?.content;

          if (fallbackContent) {
            return fallbackContent;
          }
        }
      }

      const faqFallback = await tryLocalFaqFallback(history, context);
      if (faqFallback) {
        return faqFallback;
      }

      if (status === 429) {
        return "QuickChat is getting a lot of questions right now — please try again in about a minute.";
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

  return "Sorry, that took too many steps to resolve. Please try rephrasing your question more specifically.";
}
