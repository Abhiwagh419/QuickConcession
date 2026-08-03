const API = import.meta.env.VITE_API_URL;

export interface AiChatMessage {
  role: "user" | "assistant";
  content: string;
}

export async function sendAiChatMessage(
  messages: AiChatMessage[],
  widgetRole: "student" | "staff",
): Promise<string> {
  const token =
    widgetRole === "student"
      ? localStorage.getItem("jwt")
      : localStorage.getItem("staffToken");

  if (!token) {
    throw new Error("You must be logged in to use the assistant.");
  }

  const res = await fetch(`${API}/ai/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ messages }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Assistant request failed.");
  }

  const data = await res.json();
  return data.reply as string;
}
