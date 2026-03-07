"use client";

import { X } from "lucide-react";

type ConversationTypeChoiceModalHeaderProps = {
  onClose: () => void;
};

export function ConversationTypeChoiceModalHeader({
  onClose,
}: ConversationTypeChoiceModalHeaderProps) {
  return (
    <div className="border-b-2 border-(--border) p-4">
      <div className="flex items-center justify-between gap-2">
        <h2
          id="conversation-type-choice-modal-title"
          className="font-display text-lg font-bold uppercase tracking-wider text-(--text)"
        >
          Nouvelle conversation
        </h2>
        <button
          type="button"
          onClick={onClose}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-(--text-muted) transition-colors hover:bg-(--bg) hover:text-(--text) focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          aria-label="Fermer"
        >
          <X className="h-5 w-5" aria-hidden />
        </button>
      </div>
    </div>
  );
}
