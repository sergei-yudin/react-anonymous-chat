import { useState, type FormEvent } from "react";

type Props = {
  sending: boolean;
  onSend: (content: string) => Promise<boolean>;
};

export function MessageForm({ sending, onSend }: Props) {
  const [text, setText] = useState("");

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const content = text.trim();
    if (!content) return;

    if (await onSend(content)) setText("");
  };

  return (
    <form onSubmit={(event) => void handleSubmit(event)}>
      <textarea
        aria-label="Сообщение"
        value={text}
        onChange={(event) => setText(event.target.value)}
        placeholder="Ваше сообщение..."
      />
      <button disabled={sending || !text.trim()}>
        {sending ? "…" : "Отправить"}
      </button>
    </form>
  );
}
