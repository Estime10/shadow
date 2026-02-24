import Link from "next/link";
import type { Conversation } from "@/types/message";
import { formatConversationTime } from "./fakeData";

type Props = {
  conversation: Conversation;
  isSelected: boolean;
};

function getInitial(name: string): string {
  return name.slice(0, 1).toUpperCase();
}

export function ConversationListItem({ conversation, isSelected }: Props) {
  const { participant, lastMessage, unreadCount } = conversation;
  const isFromMe = lastMessage.senderId === "me";

  return (
    <Link
      href={`/messages/${conversation.id}`}
      className={`flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-[var(--surface-hover)] ${
        isSelected ? "bg-[var(--surface)]" : ""
      }`}
    >
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 border-[var(--border)] bg-[var(--bg)] font-display text-sm font-bold uppercase text-[var(--accent)]">
        {participant.avatar ? null : getInitial(participant.name)}
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <span className="font-display text-sm font-bold uppercase tracking-wider text-[var(--text)]">
            {participant.name}
          </span>
          <span className="shrink-0 text-xs text-[var(--text-muted)]">
            {formatConversationTime(lastMessage.createdAt)}
          </span>
        </div>
        <p
          className={`mt-0.5 truncate text-sm ${
            unreadCount > 0 ? "font-semibold text-[var(--text)]" : "text-[var(--text-muted)]"
          } ${isFromMe ? "italic" : ""}`}
        >
          {isFromMe ? "Tu: " : ""}
          {lastMessage.text}
        </p>
      </div>
      {unreadCount > 0 ? (
        <span className="flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-[var(--accent)] px-1.5 font-display text-xs font-bold text-[var(--bg)]">
          {unreadCount > 99 ? "99+" : unreadCount}
        </span>
      ) : null}
    </Link>
  );
}
