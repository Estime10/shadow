"use client";

import { MessageCirclePlus } from "lucide-react";
import type { MessagesHeaderProps } from "@/features/messages/types";

export function MessagesHeader({ onOpenCreateConversation }: MessagesHeaderProps) {
  return (
    <div className="shrink-0 content-px py-3">
      <div className="flex items-center justify-between gap-4">
        <div>
          <div className="mb-2 h-1 w-12 bg-accent" />
          <h1 className="font-display text-2xl font-bold uppercase tracking-wider text-(--text)">
            Messages
          </h1>
        </div>
        {onOpenCreateConversation ? (
          <button
            type="button"
            onClick={onOpenCreateConversation}
            className="flex items-center gap-2 font-display text-sm font-bold uppercase tracking-wider text-(--text) focus:outline-none focus-visible:ring-2 focus-visible:ring-accent mt-2"
            aria-label="Créer une conversation"
          >
            <MessageCirclePlus className="h-5 w-5 text-accent" aria-hidden />
            <span className="hidden md:block">Créer une conversation</span>
          </button>
        ) : null}
      </div>
    </div>
  );
}
