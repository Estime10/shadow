import type { Conversation, Message } from "@/types/message";
import type { MessagesPageContent, MessageIdPageContent } from "./content";

/**
 * Props des composants = slice ou extension du contenu des pages (content).
 * Pas d’alias : si un composant reçoit exactement le content, il utilise MessagesPageContent ou MessageIdPageContent.
 */

/** Header liste : callback (état modal dans MessagesView) */
export type MessagesHeaderProps = {
  onOpenCreateConversation?: () => void;
};

/** Liste + empty state : content page + état modal */
export type MessagesContentProps = MessagesPageContent & {
  modalOpen: boolean;
  setModalOpen: (open: boolean) => void;
};

/** Empty state : profils + currentUser + modal (slice du page content + état) */
export type ConversationEmptyStateProps = Pick<
  MessagesPageContent,
  "profiles" | "currentUserId"
> & {
  modalOpen: boolean;
  setModalOpen: (open: boolean) => void;
  hidePanel?: boolean;
};

/** Un item = une conversation + infos liste (slice du page content) */
export type ConversationListItemProps = Pick<MessagesPageContent, "currentUserId" | "profiles"> & {
  conversation: Conversation;
  isSelected: boolean;
};

/** Header thread : slice conversation du content [id] */
export type MessageIdHeaderProps = Pick<MessageIdPageContent, "conversation">;

/** Thread = content [id] + option affichage header */
export type MessageThreadProps = MessageIdPageContent & {
  showHeader?: boolean;
};

/** Bulle = un message + currentUser (slice du content) */
export type MessageBubbleProps = Pick<MessageIdPageContent, "currentUserId"> & {
  message: Message;
};
