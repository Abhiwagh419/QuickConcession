  import { useState, useEffect, useRef } from "react";
  import { useChat } from "./useChat";
  import { Button } from "@/components/ui/button";
  import { Input } from "@/components/ui/input";
  import { motion } from "framer-motion";

  function formatDateLabel(date: Date) {
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    if (date.toDateString() === today.toDateString()) return "Today";
    if (date.toDateString() === yesterday.toDateString()) return "Yesterday";

    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }

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

        {/* SCROLLABLE MESSAGE AREA */}
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto px-6 py-4 space-y-3"
  style={{
    backgroundImage: "url('/src/assets/chat-bg.png')",
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
    backgroundColor: "rgba(0,0,0,0.2)",
    backgroundBlendMode: "overlay",
  }}
  >
          {messages.map((m, index) => {
            const currentDate =
              m.createdAt?.toDate instanceof Function
                ? m.createdAt.toDate()
                : null;

            const prevDate =
              index > 0 &&
              messages[index - 1].createdAt?.toDate instanceof Function
                ? messages[index - 1].createdAt.toDate()
                : null;

            const showDateSeparator =
              currentDate &&
              (!prevDate ||
                currentDate.toDateString() !== prevDate.toDateString());

            return (
              <div
  key={m.id}
  className={`flex mb-1 ${
    m.senderId === userId ? "justify-end" : "justify-start"
  }`}
>
    <motion.div
      id={`msg-${m.id}`}
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.15 }}
  className={`
    inline-block
    hover:scale-[1.01] transition-transform
    max-w-[70%] w-fit
    px-4 py-2
    rounded-2xl
    text-sm
    shadow
    break-words
    whitespace-pre-wrap
    overflow-hidden
    ${
      m.senderId === userId
        ? "ml-auto bg-[#075e54] text-white"
        : "mr-auto bg-white text-black"
    }
  `}
    >
      <p className="break-words">{m.text}</p>

      {currentDate && (
        <span className="block text-[10px] opacity-70 mt-1 text-right">
          {currentDate.toLocaleTimeString([], {
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

        {/* INPUT */}
        <div className="shrink-0 flex items-center gap-2 px-4 py-3 border-t bg-white">
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
            className="rounded-full"
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
