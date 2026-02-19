import { useEffect, useState } from "react";
import { collection, doc, onSnapshot, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import ChatWindow from "@/features/chat/ChatWindow";
import StaffHeader from "@/components/StaffHeader";
import { Search, MessageSquare, Users } from "lucide-react";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";

type ChatItem = {
  id: string;
  unreadCount: number;
};

type CubicBezier = [number, number, number, number];
const EASE_OUT: CubicBezier = [0.16, 1, 0.3, 1];

export default function StaffChatPage() {
  const [chats, setChats] = useState<ChatItem[]>([]);
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const staffId = "STAFF";

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "chats"), (snap) => {
      setChats(
        snap.docs.map((d) => ({
          id: d.id,
          unreadCount: d.data().unreadCount ?? 0,
        }))
      );
    });
    return () => unsub();
  }, []);

  const openChat = (chatId: string) => {
    setSelectedChat(chatId);
    setDoc(doc(db, "chats", chatId), { unreadCount: 0 }, { merge: true });
  };

  const filtered = chats.filter((c) =>
    c.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-screen flex flex-col bg-background">
      <StaffHeader />

      <div className="flex flex-1 overflow-hidden">

        {/* ── LEFT SIDEBAR ──────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.35, ease: EASE_OUT }}
          className="w-[300px] shrink-0 border-r border-border bg-card flex flex-col"
        >
          {/* Sidebar Header */}
          <div className="px-4 pt-5 pb-4 border-b border-border space-y-3">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10">
                <Users className="h-3.5 w-3.5 text-primary" />
              </div>
              <h2 className="text-sm font-semibold text-foreground">
                Student Chats
              </h2>
              {chats.length > 0 && (
                <span className="ml-auto text-[11px] font-medium text-muted-foreground tabular-nums">
                  {chats.length}
                </span>
              )}
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by enrollment…"
                className="pl-9 h-9 text-sm border-border bg-background placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-primary/30"
              />
            </div>
          </div>

          {/* Chat List */}
          <div className="flex-1 overflow-y-auto">
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-2 py-12 px-4 text-center">
                <MessageSquare className="h-8 w-8 text-muted-foreground/40" />
                <p className="text-sm text-muted-foreground">
                  {searchQuery ? "No chats match your search." : "No student chats yet."}
                </p>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {filtered.map((chat, i) => {
                  const isSelected = selectedChat === chat.id;
                  return (
                    <motion.div
                      key={chat.id}
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.25, ease: EASE_OUT, delay: i * 0.03 }}
                      onClick={() => openChat(chat.id)}
                      className={`
                        group relative flex cursor-pointer items-center justify-between
                        px-4 py-3 transition-colors duration-150
                        ${isSelected
                          ? "bg-primary/8 border-l-2 border-l-primary"
                          : "hover:bg-muted border-l-2 border-l-transparent"
                        }
                      `}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`
                          flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[11px] font-bold
                          ${isSelected
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
                          }
                          transition-colors duration-150
                        `}>
                          {chat.id.slice(0, 2).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className={`text-[13px] truncate ${isSelected ? "font-semibold text-foreground" : "font-medium text-foreground"}`}>
                            {chat.id}
                          </p>
                          <p className="text-[11px] text-muted-foreground">
                            Enrollment
                          </p>
                        </div>
                      </div>

                      {chat.unreadCount > 0 && (
                        <span className="ml-2 shrink-0 inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-primary px-1.5 text-[10px] font-bold text-primary-foreground tabular-nums">
                          {chat.unreadCount}
                        </span>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </motion.div>

        {/* ── RIGHT CHAT PANEL ──────────────────────────────────────── */}
        <div className="flex flex-1 flex-col bg-muted/30 overflow-hidden">

          {selectedChat ? (
            <>
              {/* Chat Header */}
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: EASE_OUT }}
                className="flex shrink-0 items-center gap-3 border-b border-border bg-card px-6 py-3.5"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                  <span className="text-[11px] font-bold text-primary">
                    {selectedChat.slice(0, 2).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground leading-tight">
                    {selectedChat}
                  </p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
                    <span className="text-[11px] text-muted-foreground">Online</span>
                  </div>
                </div>
              </motion.div>

              {/* Chat Window */}
              <div className="flex flex-1 overflow-hidden">
                <ChatWindow
                  chatId={selectedChat}
                  userId={staffId}
                  role="STAFF"
                />
              </div>
            </>
          ) : (
            /* Empty State */
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, ease: EASE_OUT, delay: 0.15 }}
              className="flex flex-1 flex-col items-center justify-center gap-3 text-center px-6"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-border bg-card shadow-sm">
                <MessageSquare className="h-6 w-6 text-muted-foreground/50" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-semibold text-foreground">
                  No conversation selected
                </p>
                <p className="text-[13px] text-muted-foreground max-w-xs">
                  Select a student from the sidebar to view and respond to their messages.
                </p>
              </div>
            </motion.div>
          )}
        </div>

      </div>
    </div>
  );
}