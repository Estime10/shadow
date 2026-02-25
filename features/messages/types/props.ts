import type { Conversation, Message } from "@/types/message";

/** Props pour ConversationListItem */
export type ConversationListItemProps = {
  conversation: Conversation;
  isSelected: boolean;
};

/** Props pour MessageIdHeader */
export type MessageIdHeaderProps = {
  conversation: Conversation;
};

/** Props pour MessageIdContent (et contenu page [id]) */
export type MessageIdContentProps = {
  conversation: Conversation;
  messages: Message[];
};

/** Props pour MessageThread */
export type MessageThreadProps = {
  conversation: Conversation;
  messages: Message[];
  showHeader?: boolean;
};

/** Props pour MessageBubble */
export type MessageBubbleProps = {
  message: Message;
};
