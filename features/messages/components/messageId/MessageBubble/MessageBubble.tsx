import { formatMessageDate } from "../../../data/fakeData";
import type { MessageBubbleProps } from "../../../types/props";

export function MessageBubble({ message }: MessageBubbleProps) {
  const isSent = message.senderId === "me";

  return (
    <div className={`flex w-full ${isSent ? "justify-end" : "justify-start"}`}>
      <div
        className={`group max-w-[85%] rounded-2xl px-4 py-2.5 ${
          isSent
            ? "rounded-br-md bg-[var(--accent)]/15 text-[var(--text)]"
            : "rounded-bl-md bg-[var(--surface)] text-[var(--text)]"
        }`}
      >
        <p className="text-sm leading-relaxed">{message.text}</p>
        <span
          className={`mt-1 block text-[10px] ${
            isSent ? "text-[var(--accent)]" : "text-[var(--text-muted)]"
          }`}
        >
          {formatMessageDate(message.createdAt)}
        </span>
      </div>
    </div>
  );
}
