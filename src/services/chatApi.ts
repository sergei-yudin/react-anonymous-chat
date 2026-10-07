import type { Message } from "../types";

const API = "http://localhost:7070/messages";
const messagesKey = "netology-chat-messages";
const userKey = "netology-chat-user";

export const isHostedDemo = location.hostname.endsWith("github.io");

function getLocalMessages(): Message[] {
  return JSON.parse(localStorage.getItem(messagesKey) || "[]") as Message[];
}

export function getUserId(): string {
  let id = localStorage.getItem(userKey);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(userKey, id);
  }
  return id;
}

export async function fetchMessages(from: number): Promise<Message[]> {
  if (isHostedDemo) {
    return getLocalMessages().filter((message) => message.id > from);
  }

  const response = await fetch(`${API}?from=${from}`);
  if (!response.ok) throw new Error("Unable to load messages");
  return response.json() as Promise<Message[]>;
}

export async function createMessage(
  userId: string,
  content: string,
): Promise<void> {
  if (isHostedDemo) {
    const messages = getLocalMessages();
    localStorage.setItem(
      messagesKey,
      JSON.stringify([...messages, { id: Date.now(), userId, content }]),
    );
    return;
  }

  const response = await fetch(API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id: 0, userId, content }),
  });
  if (!response.ok) throw new Error("Unable to send message");
}
