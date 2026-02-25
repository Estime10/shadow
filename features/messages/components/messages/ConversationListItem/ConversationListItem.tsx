import Link from "next/link";
import { formatConversationTime } from "../../../data/fakeData";
import type { ConversationListItemProps } from "../../../types/props";

function getInitial(name: string): string {
  return name.slice(0, 1).toUpperCase();
}

export function ConversationListItem({ conversation, isSelected }: ConversationListItemProps) {
  const { participant, lastMessage, unreadCount } = conversation;
  const isFromMe = lastMessage.senderId === "me";

  return (
    <Link
      href={`/messages/${conversation.id}`}
      className={`mx-2 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left ${
        isSelected ? "bg-surface" : ""
      }`}
    >
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 border-(--border) bg-(--bg) font-display text-sm font-bold uppercase text-accent">
        {participant.avatar ? null : getInitial(participant.name)}
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <span className="font-display text-sm font-bold uppercase tracking-wider text-(--text)">
            {participant.name}
          </span>
          <span className="shrink-0 text-xs text-(--text-muted)">
            {formatConversationTime(lastMessage.createdAt)}
          </span>
        </div>
        <p
          className={`mt-0.5 truncate text-sm ${
            unreadCount > 0 ? "font-semibold text-(--text)" : "text-(--text-muted)"
          } ${isFromMe ? "italic" : ""}`}
        >
          {isFromMe ? "Tu: " : ""}
          {lastMessage.text}
        </p>
      </div>
      {unreadCount > 0 ? (
        <span className="flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-accent px-1.5 font-display text-xs font-bold text-(--bg)">
          {unreadCount > 99 ? "99+" : unreadCount}
        </span>
      ) : null}
    </Link>
  );
}
