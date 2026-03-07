"use client";

import type { ReactNode } from "react";
import { formatRelativeTime } from "@/lib/functions";

type ConversationListItemBodyProps = {
  participantName: string;
  lastMessageText: string;
  lastMessageCreatedAt: string;
  senderLabel: string;
  isEmpty: boolean;
  isFromMe: boolean;
  unreadCount: number;
  action?: ReactNode;
};

export function ConversationListItemBody({
  participantName,
  lastMessageText,
  lastMessageCreatedAt,
  senderLabel,
  isEmpty,
  isFromMe,
  unreadCount,
  action,
}: ConversationListItemBodyProps) {
  return (
    <div className="min-w-0 flex-1">
      <div className="flex items-center justify-between gap-2">
        <span className="min-w-0 truncate font-display text-sm font-bold uppercase tracking-wider text-(--text)">
          {participantName}
        </span>
        <div className="flex shrink-0 items-center gap-2">
          {!isEmpty ? (
            <span className="text-xs text-(--text-muted)">
              {formatRelativeTime(lastMessageCreatedAt)}
            </span>
          ) : null}
          {action}
        </div>
      </div>
      <p
        className={`mt-0.5 truncate text-sm ${
          unreadCount > 0 ? "font-semibold text-(--text)" : "text-(--text-muted)"
        } ${isFromMe ? "italic" : ""}`}
      >
        {senderLabel}
        {lastMessageText}
      </p>
    </div>
  );
}
