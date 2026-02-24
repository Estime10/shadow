import { Send } from "lucide-react";
import type { Conversation, Message } from "@/types/message";
import { MessageBubble } from "./MessageBubble";

type Props = {
  conversation: Conversation;
  messages: Message[];
};

export function MessageThread({ conversation, messages }: Props) {
  return (
    <div className="flex min-h-0 flex-1 flex-col bg-[var(--bg)]">
      {/* Header */}
      <div className="flex shrink-0 items-center gap-3 bg-[var(--surface)] px-4 py-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-[var(--border)] bg-[var(--bg)] font-display text-xs font-bold uppercase text-[var(--accent)]">
          {conversation.participant.name.slice(0, 1).toUpperCase()}
        </span>
        <span className="font-display text-sm font-bold uppercase tracking-wider text-[var(--text)]">
          {conversation.participant.name}
        </span>
        <span className="text-xs text-[var(--text-muted)]">
          · 24h
        </span>
      </div>

      {/* Messages */}
      <div className="flex-1 space-y-3 overflow-y-auto p-4">
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}
      </div>

      {/* Input (fake) */}
      <div className="shrink-0 bg-[var(--surface)] p-3">
        <div className="flex items-center gap-2 rounded-xl border-2 border-[var(--border)] bg-[var(--bg)] px-4 py-2.5 focus-within:border-[var(--accent)] transition-colors">
          <span className="text-sm text-[var(--text-muted)]">
            Écris un message…
          </span>
          <button
            type="button"
            className="ml-auto flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--accent)] text-[var(--bg)] transition-opacity hover:opacity-90"
            aria-label="Envoyer"
          >
            <Send className="h-4 w-4" aria-hidden />
          </button>
        </div>
      </div>
    </div>
  );
}
