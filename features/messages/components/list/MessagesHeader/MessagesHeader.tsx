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
        <div
          className="mt-[26px]"
          role="group"
          aria-label="Délai avant disparition du message après lecture"
        >
          <p className="mb-4.5 font-display text-xs font-medium uppercase tracking-wider text-(--text-muted)">
            Disparition après lecture
          </p>
          <div className="flex rounded-lg border-2 border-(--border) bg-surface p-0.5">
            {MESSAGE_DISAPPEAR_MINUTES_OPTIONS.map((min) => {
              const isSelected = messageDisappearAfterMinutes === min;
              return (
                <button
                  key={min}
                  type="button"
                  onClick={() => onDisappearSettingChange(min)}
                  aria-pressed={isSelected}
                  className={`flex-1 rounded-md px-3 py-2 font-display text-sm font-bold uppercase tracking-wider transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg) md:cursor-pointer ${
                    isSelected
                      ? "bg-accent text-(--bg) shadow-sm"
                      : "text-(--text-muted) md:hover:bg-(--surface-hover) md:hover:text-(--text)"
                  }`}
                >
                  {min} min
                </button>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}
