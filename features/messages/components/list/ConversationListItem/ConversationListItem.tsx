import Link from "next/link";
import { ChevronRight } from "lucide-react";
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
    <div
      className={`mx-2 flex w-full items-start gap-3 rounded-xl content-px py-3 text-left ${
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
        action={
          <Link
            href={`/messages/${conversation.id}`}
            className="inline-flex md:cursor-pointer items-center justify-center rounded-lg p-0.5 transition-colors md:hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            aria-label={`Ouvrir la conversation avec ${participant.name ?? "ce contact"}`}
          >
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-accent/20 text-accent">
              <ChevronRight className="h-4 w-4" aria-hidden />
            </span>
          </Link>
        }
      />
      <ConversationListItemBadge unreadCount={unreadCount} />
    </div>
  );
}
