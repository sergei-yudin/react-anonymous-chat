import { useEffect, useRef } from "react";
import type { Message } from "../types";

type Props = {
  messages: Message[];
  userId: string;
};

export function MessageList({ messages, userId }: Props) {
  const end = useRef<HTMLDivElement>(null);

  useEffect(() => {
    end.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <section className="chat">
      {messages.length === 0 && (
        <p className="empty">Напишите первое сообщение</p>
      )}
      {messages.map((message) => (
        <article
          className={message.userId === userId ? "own" : "other"}
          key={message.id}
        >
          <small>
            {message.userId === userId ? "Вы" : message.userId.slice(0, 8)}
          </small>
          <p>{message.content}</p>
        </article>
      ))}
      <div ref={end} />
    </section>
  );
}
