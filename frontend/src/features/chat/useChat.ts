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
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export function useChat(chatId: string) {
  const [messages, setMessages] = useState<any[]>([]);

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

  const sendMessage = async (
    text: string,
    senderId: string,
    role: "STUDENT" | "STAFF"
  ) => {
    if (!text.trim()) return;

    const chatRef = doc(db, "chats", chatId);
    const messagesRef = collection(chatRef, "messages");

    // ✅ THIS CREATES / UPDATES THE CHAT DOCUMENT (CRITICAL)
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

    // ✅ THIS CREATES THE MESSAGE
    await addDoc(messagesRef, {
      text,
      senderId,
      role,
      createdAt: serverTimestamp(),
    });
  };

  return { messages, sendMessage };
}
