import { ChatHeader } from "./components/ChatHeader";
import { MessageForm } from "./components/MessageForm";
import { MessageList } from "./components/MessageList";
import { useChat } from "./hooks/useChat";
import { isHostedDemo } from "./services/chatApi";
import "./App.css";

export default function App() {
  const { userId, messages, error, sending, sendMessage } = useChat();

  return (
    <main>
      <ChatHeader userId={userId} />
      {isHostedDemo && (
        <p className="mode">
          Демо-режим работает между вкладками этого браузера
        </p>
      )}
      {error && (
        <p role="alert" className="error">
          {error}
        </p>
      )}
      <MessageList messages={messages} userId={userId} />
      <MessageForm sending={sending} onSend={sendMessage} />
    </main>
  );
}
