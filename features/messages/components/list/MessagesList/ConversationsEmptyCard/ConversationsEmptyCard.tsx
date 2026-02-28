"use client";

import { MessageCirclePlus } from "lucide-react";
import { EMPTY_LAST_MESSAGE_TEXT } from "@/features/messages/constants/constants";

type ConversationsEmptyCardProps = {
  onOpenCreateConversation: () => void;
};

export function ConversationsEmptyCard({ onOpenCreateConversation }: ConversationsEmptyCardProps) {
  return (
    <div className="flex flex-col items-center gap-3 pt-2">
      <p className="font-display text-sm font-medium uppercase tracking-wider text-(--text-muted)">
        {EMPTY_LAST_MESSAGE_TEXT}
      </p>
      <button
        type="button"
        onClick={onOpenCreateConversation}
        className="flex flex-col items-center gap-2 rounded-lg p-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        aria-label="Créer une conversation"
      >
        <MessageCirclePlus className="h-8 w-8 text-accent" aria-hidden />
        <span className="font-display text-xs font-bold uppercase tracking-wider text-(--text)">
          Créer une conversation
        </span>
      </button>
    </div>
  );
}
