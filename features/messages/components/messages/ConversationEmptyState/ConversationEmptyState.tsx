import { MessageCircle } from "lucide-react";

export function ConversationEmptyState() {
  return (
    <div className="hidden flex-1 flex-col items-center justify-center gap-4 bg-[var(--bg)] p-8 lg:flex">
      <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-[var(--border)] bg-[var(--surface)]">
        <MessageCircle className="h-8 w-8 text-[var(--text-muted)]" aria-hidden />
      </div>
      <p className="text-center font-display text-sm font-bold uppercase tracking-wider text-[var(--text-muted)]">
        Choisis une conversation
      </p>
    </div>
  );
}
