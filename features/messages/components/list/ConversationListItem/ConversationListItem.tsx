import Link from "next/link";
import type { ConversationListItemProps } from "@/features/messages/types";
import { getInitial, getLastMessageSenderLabel } from "@/features/messages/utils";
import { EMPTY_LAST_MESSAGE_TEXT } from "@/features/messages/constants";
import { ConversationListItemAvatar } from "./ConversationListItemAvatar/ConversationListItemAvatar";
import { ConversationListItemBody } from "./ConversationListItemBody/ConversationListItemBody";

export function ConversationListItem({
  conversation,
  currentUserId,
  profiles,
}: ConversationListItemProps) {
  const { participant, lastMessage, unreadCount } = conversation;
  const isFromMe = currentUserId != null && lastMessage.senderId === currentUserId;
  const isEmpty = lastMessage.text === EMPTY_LAST_MESSAGE_TEXT;
  const senderLabel = getLastMessageSenderLabel(lastMessage.senderId, currentUserId, profiles);

  const hasUnread = unreadCount > 0;
  return (
    <Link
      href={`/messages/${conversation.id}`}
      className={`flex w-full items-start gap-3 rounded-xl content-px py-3 text-left transition-colors md:cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-accent ${hasUnread ? "bg-(--surface-unread)" : "bg-surface"}`}
      aria-label={`Ouvrir la conversation avec ${participant.name ?? "ce contact"}`}
    >
      <ConversationListItemAvatar
        initial={participant.avatar ? "" : getInitial(participant.name ?? null)}
      />
      <ConversationListItemBody
        participantName={participant.name ?? ""}
        lastMessageText={lastMessage.text}
        lastMessageCreatedAt={lastMessage.createdAt}
        senderLabel={senderLabel}
        isEmpty={isEmpty}
        isFromMe={isFromMe}
        unreadCount={unreadCount}
      />
    </Link>
  );
}
