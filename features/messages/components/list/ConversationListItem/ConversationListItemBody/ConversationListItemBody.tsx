"use client";

import { formatEuropeanDateTime } from "@/lib/functions";

type ConversationListItemBodyProps = {
  participantName: string;
  lastMessageText: string;
  lastMessageCreatedAt: string;
  senderLabel: string;
  isEmpty: boolean;
  isFromMe: boolean;
  unreadCount: number;
};

export function ConversationListItemBody({
  participantName,
  lastMessageText,
  lastMessageCreatedAt,
  senderLabel,
  isEmpty,
  isFromMe,
  unreadCount,
}: ConversationListItemBodyProps) {
  return (
    <div className="min-w-0 flex-1">
      <span className="block min-w-0 truncate font-display text-sm font-bold uppercase tracking-wider text-(--text)">
        {participantName}
      </span>
      {!isEmpty ? (
        <p className="mt-0.5 text-xs text-(--text-muted)">
          {formatEuropeanDateTime(lastMessageCreatedAt)}
        </p>
      ) : null}
      <p
        className={`mt-0.5 truncate text-sm ${
          unreadCount > 0 ? "font-semibold text-(--text)" : "text-(--text-muted)"
        } ${isFromMe ? "italic" : ""}`}
      >
        <span className="uppercase">{senderLabel}</span>
        {lastMessageText}
      </p>
    </div>
  );
}
