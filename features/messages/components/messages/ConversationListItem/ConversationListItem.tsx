import Link from "next/link";
import { formatRelativeTime } from "@/lib/functions";
import type { ConversationListItemProps } from "../../../types/props";

function getInitial(name: string): string {
  return name.slice(0, 1).toUpperCase();
}

function getLastMessageSenderLabel(
  senderId: string,
  currentUserId: string | null,
  profiles: { id: string; username: string | null }[]
): string {
  if (currentUserId != null && senderId === currentUserId) return "Moi: ";
  const sender = profiles.find((p) => p.id === senderId);
  const name = sender?.username?.trim() ?? "Sans pseudo";
  return `${name}: `;
}

export function ConversationListItem({
  conversation,
  isSelected,
  currentUserId,
  profiles,
}: ConversationListItemProps) {
  const { participant, lastMessage, unreadCount } = conversation;
  const isFromMe = currentUserId != null && lastMessage.senderId === currentUserId;
  const isEmpty = lastMessage.text === "Aucun message";
  const senderLabel = getLastMessageSenderLabel(lastMessage.senderId, currentUserId, profiles);

  const href = `/messages/${conversation.id}`;

  return (
    <Link
      href={href}
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
          {!isEmpty ? (
            <span className="shrink-0 text-xs text-(--text-muted)">
              {formatRelativeTime(lastMessage.createdAt)}
            </span>
          ) : null}
        </div>
        <p
          className={`mt-0.5 truncate text-sm ${
            unreadCount > 0 ? "font-semibold text-(--text)" : "text-(--text-muted)"
          } ${isFromMe ? "italic" : ""}`}
        >
          {senderLabel}
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
