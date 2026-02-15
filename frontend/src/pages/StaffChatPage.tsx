import { useEffect, useState } from "react";
import { collection, doc, onSnapshot, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import ChatWindow from "@/features/chat/ChatWindow";
import StaffHeader from "@/components/StaffHeader";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

type ChatItem = {
  id: string;
  unreadCount: number;
};

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
    <div className="h-screen flex flex-col">
      <StaffHeader />

      <div className="flex flex-1 overflow-hidden">
        {/* LEFT SIDEBAR */}
        <div className="w-[320px] border-r bg-white flex flex-col">
          <div className="p-4 border-b">
            <h2 className="font-semibold text-lg mb-3">Student Chats</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className="pl-9"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {filtered.map((chat) => (
              <div
                key={chat.id}
                onClick={() => openChat(chat.id)}
                className={`cursor-pointer px-4 py-3 border-b hover:bg-gray-100 flex justify-between items-center
                  ${
                    selectedChat === chat.id
                      ? "bg-gray-200 font-medium"
                      : ""
                  }`}
              >
                <span>Enrollment: {chat.id}</span>

                {chat.unreadCount > 0 && (
                  <span className="bg-green-500 text-white text-xs px-2 py-0.5 rounded-full">
                    {chat.unreadCount}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

       {/* RIGHT CHAT PANEL */}
<div className="flex-1 flex flex-col bg-gray-50 overflow-hidden">

  {selectedChat && (
    <div className="flex items-center gap-3 px-6 py-3 bg-white border-b shrink-0">
      <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
      <span className="font-medium">
        Enrollment: {selectedChat}
      </span>
      <span className="text-xs text-gray-500">Online</span>
    </div>
  )}

  {selectedChat ? (
    <div className="flex-1 flex overflow-hidden">
      <ChatWindow
        chatId={selectedChat}
        userId={staffId}
        role="STAFF"
      />
    </div>
  ) : (
    <div className="flex flex-1 items-center justify-center text-gray-500">
      Select a student to start chatting
    </div>
  )}
</div>
      </div>
    </div>
  );
}
