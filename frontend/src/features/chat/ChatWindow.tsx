import { useState, useEffect, useRef } from "react";
import { useChat } from "./useChat";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";

export default function ChatWindow({
  chatId,
  userId,
  role,
  variant = "page",
}: {
  chatId: string;
  userId: string;
  role: "STUDENT" | "STAFF";
  variant?: "page" | "modal";
}) {
  const { messages, sendMessage } = useChat(chatId);
  const [text, setText] = useState("");

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="flex flex-col w-full h-full overflow-hidden bg-white">
      <div
        ref={scrollRef}
        className="flex flex-col flex-1 min-w-0 overflow-y-auto px-3 sm:px-4 py-4 space-y-3"
        style={{
          backgroundImage: "url('/src/assets/chat-bg.png')",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          backgroundColor: "rgba(0,0,0,0.2)",
          backgroundBlendMode: "overlay",
        }}
      >
        {messages.map((m) => {
          const isMe = m.senderId === userId;

          return (
            <div
              key={m.id}
              className={`flex mb-1 px-1 min-w-0 ${
                isMe ? "justify-end" : "justify-start"
              }`}
            >
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.15 }}
                className={`
  block
  w-fit
  max-w-[85%] sm:max-w-[75%]
  px-4 py-2
  rounded-2xl
  text-sm
  shadow
  whitespace-pre-wrap
  break-words
  overflow-wrap-anywhere
  shrink
  ${
    isMe
      ? "ml-auto mr-2 bg-[#075e54] text-white"
      : "mr-auto ml-2 bg-white text-black"
  }
`}
              >
                <p className="break-all whitespace-pre-wrap">{m.text}</p>

                {m.createdAt?.toDate && (
                  <span className="block text-[10px] opacity-70 mt-1 text-right">
                    {m.createdAt.toDate().toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                )}
              </motion.div>
            </div>
          );
        })}
      </div>

      <div className="shrink-0 flex items-center gap-2 px-3 py-3 border-t bg-white">
        <Input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type message..."
          className="rounded-full"
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
          className="rounded-full bg-black text-white hover:bg-slate-900"
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
