import { useState } from "react";
import { useChat } from "./useChat";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ChatWindow({
  chatId,
  userId,
  role,
}: {
  chatId: string;
  userId: string;
  role: "STUDENT" | "STAFF";
}) {
  const { messages, sendMessage } = useChat(chatId);
  const [text, setText] = useState("");

  return (
    <div className="flex flex-col h-[400px] border rounded-lg">
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`max-w-[70%] p-2 rounded ${
              m.senderId === userId
                ? "ml-auto bg-primary text-white"
                : "bg-muted"
            }`}
          >
            <p className="text-sm">{m.text}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-2 p-2 border-t">
        <Input
  value={text}
  onChange={(e) => setText(e.target.value)}
  placeholder="Type message..."
  onKeyDown={(e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();

      if (!text.trim()) return;

      sendMessage(text, userId, role);
      setText("");
    }
  }}
/>

        <Button
          onClick={() => {
            if (!text.trim()) return;
            sendMessage(text, userId, role);
            setText("");
          }}
        >
          Send
        </Button>
      </div>
    </div>
  );
}
