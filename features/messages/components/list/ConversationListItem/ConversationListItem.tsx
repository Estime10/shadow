import Link from "next/link";
import type { ConversationListItemProps } from "@/features/messages/types";
import { getInitial, getLastMessageSenderLabel } from "@/features/messages/utils";
import { EMPTY_LAST_MESSAGE_TEXT } from "@/features/messages/constants";
import { ConversationListItemAvatar } from "./ConversationListItemAvatar/ConversationListItemAvatar";
import { ConversationListItemBody } from "./ConversationListItemBody/ConversationListItemBody";
import { ConversationListItemBadge } from "./ConversationListItemBadge/ConversationListItemBadge";

export function ConversationListItem({
  conversation,
  isSelected,
  currentUserId,
  profiles,
}: ConversationListItemProps) {
  const { participant, lastMessage, unreadCount } = conversation;
  const isFromMe = currentUserId != null && lastMessage.senderId === currentUserId;
  const isEmpty = lastMessage.text === EMPTY_LAST_MESSAGE_TEXT;
  const senderLabel = getLastMessageSenderLabel(lastMessage.senderId, currentUserId, profiles);

  return (
    <Link
      href={`/messages/${conversation.id}`}
      className={`mx-2 flex w-full items-center gap-3 rounded-xl content-px py-3 text-left ${
        isSelected ? "bg-surface" : ""
      }`}
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
      <ConversationListItemBadge unreadCount={unreadCount} />
    </Link>
  );
}
