"use client";

import { MessageCircle, Users } from "lucide-react";

type ConversationTypeChoiceOptionsProps = {
  onSelectDirect: () => void;
  onSelectGroup: () => void;
};

export function ConversationTypeChoiceOptions({
  onSelectDirect,
  onSelectGroup,
}: ConversationTypeChoiceOptionsProps) {
  return (
    <div className="flex flex-col gap-2 p-4">
      <button
        type="button"
        onClick={onSelectDirect}
        className="flex items-center gap-3 rounded-xl border-2 border-(--border) bg-(--bg) content-px py-4 text-left transition-colors hover:border-accent hover:bg-(--accent)/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
      >
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-(--accent)/15 text-accent">
          <MessageCircle className="h-6 w-6" aria-hidden />
        </span>
        <div className="min-w-0">
          <span className="block font-display text-sm font-bold uppercase tracking-wider text-(--text)">
            Message direct
          </span>
          <span className="block text-xs text-(--text-muted)">Conversation à deux</span>
        </div>
      </button>
      <button
        type="button"
        onClick={onSelectGroup}
        className="flex items-center gap-3 rounded-xl border-2 border-(--border) bg-(--bg) content-px py-4 text-left transition-colors hover:border-accent hover:bg-(--accent)/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
      >
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-(--accent)/15 text-accent">
          <Users className="h-6 w-6" aria-hidden />
        </span>
        <div className="min-w-0">
          <span className="block font-display text-sm font-bold uppercase tracking-wider text-(--text)">
            Groupe chat
          </span>
          <span className="block text-xs text-(--text-muted)">Conversation à plusieurs</span>
        </div>
      </button>
    </div>
  );
}
