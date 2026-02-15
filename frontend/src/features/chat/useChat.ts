import { useEffect, useState } from "react";
import {
  collection,
  doc,
  addDoc,
  setDoc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  increment,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export function useChat(chatId: string) {
  const [messages, setMessages] = useState<any[]>([]);

  // 🔹 Listen to messages
  useEffect(() => {
    const messagesRef = collection(db, "chats", chatId, "messages");
    const q = query(messagesRef, orderBy("createdAt", "asc"));

    const unsub = onSnapshot(q, (snap) => {
      setMessages(
        snap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }))
      );
    });

    return () => unsub();
  }, [chatId]);

  // 🔹 Send message
  const sendMessage = async (
    text: string,
    senderId: string,
    role: "STUDENT" | "STAFF"
  ) => {
    if (!text.trim()) return;

    const chatRef = doc(db, "chats", chatId);

    // 1️⃣ Create message
    await addDoc(collection(chatRef, "messages"), {
      text,
      senderId,
      senderRole: role,
      createdAt: serverTimestamp(),
      read: role === "STAFF", // staff messages are auto-read
    });

    // 2️⃣ Update chat metadata
    await setDoc(
      chatRef,
      {
        enrollmentNo: chatId,
        lastMessage: text,
        lastSender: role,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
  };

  return { messages, sendMessage};
}
