import { useCallback, useEffect, useRef, useState } from "react";
import { createMessage, fetchMessages, getUserId } from "../services/chatApi";
import type { Message } from "../types";

export function useChat() {
  const [userId] = useState(getUserId);
  const [messages, setMessages] = useState<Message[]>([]);
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  const lastMessageId = useRef(0);

  const pollMessages = useCallback(async () => {
    try {
      const fresh = await fetchMessages(lastMessageId.current);
      if (fresh.length) {
        setMessages((current) => {
          const existingIds = new Set(current.map((message) => message.id));
          return [
            ...current,
            ...fresh.filter((message) => !existingIds.has(message.id)),
          ];
        });
        lastMessageId.current = fresh.at(-1)?.id ?? lastMessageId.current;
      }
      setError("");
    } catch {
      setError("Сервер чата недоступен.");
    }
  }, []);

  useEffect(() => {
    void pollMessages();
    const timer = window.setInterval(() => void pollMessages(), 2_000);
    return () => window.clearInterval(timer);
  }, [pollMessages]);

  const sendMessage = async (content: string) => {
    setSending(true);
    try {
      await createMessage(userId, content);
      setError("");
      await pollMessages();
      return true;
    } catch {
      setError("Не удалось отправить сообщение.");
      return false;
    } finally {
      setSending(false);
    }
  };

  return { userId, messages, error, sending, sendMessage };
}
