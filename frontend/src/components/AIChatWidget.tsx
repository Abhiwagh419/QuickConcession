import { useRef, useState, useEffect } from "react";
import { MessageCircle, X, Send, Loader2, Bot, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { sendAiChatMessage, AiChatMessage } from "@/lib/aiChat";
import { cn } from "@/lib/utils";

interface AIChatWidgetProps {
  role: "student" | "staff";
}

interface QuickAction {
  label: string;
  text: string;
  autoSend: boolean;
}

const studentQuickActions: QuickAction[] = [
  {
    label: "Check my application status",
    text: "How is my application doing?",
    autoSend: true,
  },
  {
    label: "Am I eligible?",
    text: "Am I eligible for a concession?",
    autoSend: true,
  },
  {
    label: "Why do rejections happen?",
    text: "Why was my application rejected?",
    autoSend: true,
  },
  {
    label: "How long does approval take?",
    text: "How long does approval usually take?",
    autoSend: true,
  },
];

const staffQuickActions: QuickAction[] = [
  {
    label: "Look up an application",
    text: "Tell me about application ID ",
    autoSend: false,
  },
  {
    label: "Eligibility rules",
    text: "What are the eligibility rules for a concession?",
    autoSend: true,
  },
  {
    label: "How long does approval take?",
    text: "How long does approval usually take?",
    autoSend: true,
  },
];

export default function AIChatWidget({ role }: AIChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<AiChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const quickActions =
    role === "student" ? studentQuickActions : staffQuickActions;

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, isSending]);

  const sendMessage = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isSending) return;

    const nextMessages: AiChatMessage[] = [
      ...messages,
      { role: "user", content: trimmed },
    ];

    setMessages(nextMessages);
    setInput("");
    setError(null);
    setIsSending(true);

    try {
      const reply = await sendAiChatMessage(nextMessages, role);
      setMessages([...nextMessages, { role: "assistant", content: reply }]);
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsSending(false);
    }
  };

  const handleQuickAction = (action: QuickAction) => {
    if (action.autoSend) {
      sendMessage(action.text);
    } else {
      setInput(action.text);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen && (
        <div className="mb-3 w-80 sm:w-96 h-[28rem] rounded-xl border bg-background shadow-xl flex flex-col overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b bg-muted/40">
            <div className="flex items-center gap-2">
              <Bot className="w-4 h-4" />
              <span className="text-sm font-medium">QuickConcession Assistant</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              aria-label="Close assistant"
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto px-4 py-3 space-y-3"
          >
            {messages.length === 0 && (
              <div className="space-y-3">
                <div className="flex gap-2 text-sm justify-start">
                  <Bot className="w-4 h-4 mt-1 shrink-0 text-muted-foreground" />
                  <div className="rounded-lg px-3 py-2 max-w-[85%] bg-muted">
                    Hi! How can I help you today? Pick an option below, or
                    type your own question.
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 pl-6">
                  {quickActions.map((action) => (
                    <button
                      key={action.label}
                      onClick={() => handleQuickAction(action)}
                      className="text-xs rounded-full border border-input bg-background px-3 py-1.5 hover:bg-muted transition"
                    >
                      {action.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((message, index) => (
              <div
                key={index}
                className={cn(
                  "flex gap-2 text-sm",
                  message.role === "user" ? "justify-end" : "justify-start",
                )}
              >
                {message.role === "assistant" && (
                  <Bot className="w-4 h-4 mt-1 shrink-0 text-muted-foreground" />
                )}
                <div
                  className={cn(
                    "rounded-lg px-3 py-2 max-w-[80%] whitespace-pre-wrap",
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted",
                  )}
                >
                  {message.content}
                </div>
                {message.role === "user" && (
                  <User className="w-4 h-4 mt-1 shrink-0 text-muted-foreground" />
                )}
              </div>
            ))}

            {isSending && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="w-4 h-4 animate-spin" />
                Thinking...
              </div>
            )}

            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}
          </div>

          <div className="border-t p-3 flex items-center gap-2">
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your question..."
              disabled={isSending}
              className="flex-1 h-9 rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
            <Button
              size="icon"
              onClick={() => sendMessage(input)}
              disabled={isSending || !input.trim()}
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      <Button
        size="icon"
        className="h-12 w-12 rounded-full shadow-lg"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label="Open assistant"
      >
        {isOpen ? <X className="w-5 h-5" /> : <MessageCircle className="w-5 h-5" />}
      </Button>
    </div>
  );
}
