"use client";

type ConversationListItemAvatarProps = {
  initial: string;
};

export function ConversationListItemAvatar({ initial }: ConversationListItemAvatarProps) {
  return (
    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 border-(--border) bg-(--bg) font-display text-sm font-bold uppercase text-accent">
      {initial}
    </span>
  );
}
