"use client";

import { MessageCirclePlus } from "lucide-react";
import { MESSAGE_DISAPPEAR_MINUTES_OPTIONS } from "@/lib/supabase/CRUD/profiles/types/types";
import type { MessagesHeaderProps } from "@/features/messages/types";

export function MessagesHeader({
  onOpenCreateConversation,
  messageDisappearAfterMinutes = 30,
  onDisappearSettingChange,
}: MessagesHeaderProps) {
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
            className="flex md:cursor-pointer items-center gap-2 font-display text-sm font-bold uppercase tracking-wider text-(--text) focus:outline-none focus-visible:ring-2 focus-visible:ring-accent mt-2 transition-colors md:hover:text-accent"
            aria-label="Créer une conversation"
          >
            <MessageCirclePlus className="h-5 w-5 text-accent" aria-hidden />
            <span className="hidden md:block">Créer une conversation</span>
          </button>
        ) : null}
      </div>
      {onDisappearSettingChange ? (
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <label
            htmlFor="message-disappear-setting"
            className="font-display text-xs font-medium uppercase tracking-wider text-(--text-muted)"
          >
            Disparition après lecture :
          </label>
          <select
            id="message-disappear-setting"
            value={messageDisappearAfterMinutes}
            onChange={(e) => onDisappearSettingChange(Number(e.target.value) as 15 | 30 | 45 | 60)}
            className="rounded-lg border-2 border-(--border) bg-(--bg) px-2 py-1.5 font-display text-sm text-(--text) focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            aria-label="Délai avant disparition du message après lecture"
          >
            {MESSAGE_DISAPPEAR_MINUTES_OPTIONS.map((min) => (
              <option key={min} value={min}>
                {min} min
              </option>
            ))}
          </select>
        </div>
      ) : null}
    </div>
  );
}
