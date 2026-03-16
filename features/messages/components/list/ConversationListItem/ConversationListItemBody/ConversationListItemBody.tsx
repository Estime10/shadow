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
    <div className="min-w-0 flex-1 space-y-1.5">
      <span className="block min-w-0 truncate font-display text-sm font-bold uppercase tracking-wider text-(--text)">
        {participantName}
      </span>
      {!isEmpty ? (
        <p className="text-xs text-(--text-muted)">
          {formatEuropeanDateTime(lastMessageCreatedAt)}
        </p>
      ) : null}
      <div
        className={`flex flex-col gap-0.5 text-xs ${
          unreadCount > 0 ? "font-semibold text-(--text)" : "text-(--text-muted)"
        } ${isFromMe ? "italic" : ""}`}
      >
        <span className="shrink-0 uppercase">{senderLabel}</span>
        <span className="min-w-0 truncate">{lastMessageText}</span>
      </div>
    </div>
  );
}
