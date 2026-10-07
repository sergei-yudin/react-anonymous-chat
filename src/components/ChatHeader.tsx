type Props = {
  userId: string;
};

export function ChatHeader({ userId }: Props) {
  return (
    <header>
      <h1>Анонимный чат</h1>
      <span>Ваш ID: {userId.slice(0, 8)}</span>
    </header>
  );
}
