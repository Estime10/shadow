"use client";

type ConversationListItemBadgeProps = {
  unreadCount: number;
};

export function ConversationListItemBadge({ unreadCount }: ConversationListItemBadgeProps) {
  if (unreadCount <= 0) return null;
  return (
    <span className="flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-accent px-1.5 font-display text-xs font-bold text-(--bg)">
      {unreadCount > 99 ? "99+" : unreadCount}
    </span>
  );
}
