import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import ChatWindow from "@/features/chat/ChatWindow";
import { Card } from "@/components/ui/card";

type ChatItem = {
  id: string; // enrollment number
};

export default function StaffChatPage() {
  const [chats, setChats] = useState<ChatItem[]>([]);
  const [selectedChat, setSelectedChat] = useState<string | null>(null);

  const staffId = "STAFF_1"; // ✅ use real staff ID from token later

  // 🔹 Fetch all active chats
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "chats"), (snap) => {
      const list = snap.docs.map((d) => ({
        id: d.id,
      }));
      setChats(list);
    });

    return () => unsub();
  }, []);

  return (
    <div className="grid grid-cols-3 gap-4 h-[80vh]">
      {/* LEFT: Student Chat List */}
      <Card className="col-span-1 p-3 overflow-y-auto">
        <h2 className="font-semibold mb-2">Student Chats</h2>

        {chats.length === 0 && (
          <p className="text-sm text-muted-foreground">
            No active chats
          </p>
        )}

        {chats.map((chat) => (
          <div
            key={chat.id}
            className={`p-2 rounded cursor-pointer mb-1 ${
              selectedChat === chat.id
                ? "bg-primary text-white"
                : "hover:bg-muted"
            }`}
            onClick={() => setSelectedChat(chat.id)}
          >
            Enrollment: {chat.id}
          </div>
        ))}
      </Card>

      {/* RIGHT: Chat Window */}
      <Card className="col-span-2 p-3">
        {selectedChat ? (
          <ChatWindow
            chatId={selectedChat}
            userId={staffId}
            role="STAFF"
          />
        ) : (
          <p className="text-muted-foreground">
            Select a student to start chatting
          </p>
        )}
      </Card>
    </div>
  );
}
