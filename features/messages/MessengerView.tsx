"use client";

import { MessageCircle } from "lucide-react";
import { FAKE_CONVERSATIONS } from "./fakeData";
import { ConversationListItem } from "./ConversationListItem";

export function MessengerView() {
  return (
    <div className="flex h-full min-h-0 flex-col lg:flex-row">
      <aside className="flex flex-1 flex-col bg-[var(--surface)] lg:max-w-sm min-h-0">
        <div className="shrink-0 px-4 py-3">
          <h2 className="font-display text-xs font-bold uppercase tracking-widest text-[var(--text-muted)]">
            Conversations
          </h2>
        </div>
        <div className="flex-1 overflow-y-auto">
          {FAKE_CONVERSATIONS.map((conv) => (
            <ConversationListItem key={conv.id} conversation={conv} isSelected={false} />
          ))}
        </div>
      </aside>

      <div className="hidden flex-1 flex-col items-center justify-center gap-4 bg-[var(--bg)] p-8 lg:flex">
        <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-[var(--border)] bg-[var(--surface)]">
          <MessageCircle className="h-8 w-8 text-[var(--text-muted)]" aria-hidden />
        </div>
        <p className="text-center font-display text-sm font-bold uppercase tracking-wider text-[var(--text-muted)]">
          Choisis une conversation
        </p>
      </div>
    </div>
  );
}
