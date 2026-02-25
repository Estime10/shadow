"use client";

import { FAKE_CONVERSATIONS } from "../../../data/fakeData";
import { ConversationListItem } from "../ConversationListItem/ConversationListItem";
import { ConversationEmptyState } from "../ConversationEmptyState/ConversationEmptyState";

export function MessagesList() {
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

      <ConversationEmptyState />
    </div>
  );
}
