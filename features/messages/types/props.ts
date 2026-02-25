import type { Conversation, Message } from "@/types/message";
import type { MessagesPageContent, MessageIdPageContent } from "./content";

/**
 * Tous les types de props sont dérivés du contenu des pages (content).
 * La page fetch en server et passe le content ; les enfants reçoivent une partie ou un prolongement.
 */

/** Ce que la page /messages passe à MessagesView (use server → props) */
export type MessagesViewProps = MessagesPageContent;

/** Header liste : uniquement le callback (état modal géré dans MessagesView) */
export type MessagesHeaderProps = {
  onOpenCreateConversation?: () => void;
};

/** Contenu liste + état modal (passé par MessagesView à MessagesContent) */
export type MessagesContentProps = MessagesPageContent & {
  modalOpen: boolean;
  setModalOpen: (open: boolean) => void;
};

/** Alias pour MessagesList (reçoit la même chose que MessagesContent) */
export type MessagesListProps = MessagesContentProps;

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

/** Page [id] : ce que la page passe à MessageIdHeader */
export type MessageIdHeaderProps = Pick<MessageIdPageContent, "conversation">;

/** Page [id] : ce que la page passe à MessageIdContent (= content brut) */
export type MessageIdContentProps = MessageIdPageContent;

/** Thread = content + option affichage header */
export type MessageThreadProps = MessageIdPageContent & {
  showHeader?: boolean;
};

/** Bulle = un message + currentUser (slice du content) */
export type MessageBubbleProps = Pick<MessageIdPageContent, "currentUserId"> & {
  message: Message;
};
