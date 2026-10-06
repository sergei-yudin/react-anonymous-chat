import { useEffect, useRef, useState, type FormEvent } from "react";
import "./App.css";
type Message = { id: number; userId: string; content: string };
const API = "http://localhost:7070/messages";
const hosted = location.hostname.endsWith("github.io");
const messagesKey = "netology-chat-messages";
const userKey = "netology-chat-user";
function userId() {
  let id = localStorage.getItem(userKey);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(userKey, id);
  }
  return id;
}
function localMessages(): Message[] {
  return JSON.parse(localStorage.getItem(messagesKey) || "[]") as Message[];
}
export default function App() {
  const [me] = useState(userId);
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  const last = useRef(0);
  const end = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let active = true;
    const poll = async () => {
      try {
        const fresh = hosted
          ? localMessages().filter((m) => m.id > last.current)
          : await fetch(`${API}?from=${last.current}`).then((r) => {
              if (!r.ok) throw new Error();
              return r.json() as Promise<Message[]>;
            });
        if (active && fresh.length) {
          setMessages((current) => {
            const ids = new Set(current.map((m) => m.id));
            return [...current, ...fresh.filter((m) => !ids.has(m.id))];
          });
          last.current = fresh.at(-1)?.id ?? last.current;
        }
        setError("");
      } catch {
        if (active) setError("Сервер чата недоступен.");
      }
    };
    void poll();
    const timer = window.setInterval(() => void poll(), 2000);
    return () => {
      active = false;
      window.clearInterval(timer);
    };
  }, []);
  useEffect(() => {
    end.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  const send = async (e: FormEvent) => {
    e.preventDefault();
    const content = text.trim();
    if (!content) return;
    setSending(true);
    try {
      if (hosted) {
        const all = localMessages();
        localStorage.setItem(
          messagesKey,
          JSON.stringify([...all, { id: Date.now(), userId: me, content }]),
        );
      } else {
        const r = await fetch(API, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: 0, userId: me, content }),
        });
        if (!r.ok) throw new Error();
      }
      setText("");
      setError("");
    } catch {
      setError("Не удалось отправить сообщение.");
    } finally {
      setSending(false);
    }
  };
  return (
    <main>
      <header>
        <h1>Анонимный чат</h1>
        <span>Ваш ID: {me.slice(0, 8)}</span>
      </header>
      {hosted && (
        <p className="mode">
          Демо-режим работает между вкладками этого браузера
        </p>
      )}
      {error && (
        <p role="alert" className="error">
          {error}
        </p>
      )}
      <section className="chat">
        {messages.length === 0 && (
          <p className="empty">Напишите первое сообщение</p>
        )}
        {messages.map((m) => (
          <article className={m.userId === me ? "own" : "other"} key={m.id}>
            <small>{m.userId === me ? "Вы" : m.userId.slice(0, 8)}</small>
            <p>{m.content}</p>
          </article>
        ))}
        <div ref={end} />
      </section>
      <form onSubmit={send}>
        <textarea
          aria-label="Сообщение"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Ваше сообщение..."
        />
        <button disabled={sending || !text.trim()}>
          {sending ? "…" : "Отправить"}
        </button>
      </form>
    </main>
  );
}
