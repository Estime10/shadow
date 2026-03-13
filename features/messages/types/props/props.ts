import type { Conversation, Message } from "@/types/message";
import type { ThreadCacheKey } from "@/lib/hooks/messages";
import type { MessagesPageContent, MessageIdPageContent } from "../content/content";

/**
 * Props des composants = slice ou extension du contenu des pages (content).
 * Pas d'alias : si un composant reçoit exactement le content, il utilise MessagesPageContent ou MessageIdPageContent.
 */

import type { MessageDisappearAfterMinutes } from "@/types";

/** Header liste : callback (état modal dans MessagesView) + réglage disparition après lecture */
export type MessagesHeaderProps = {
  onOpenCreateConversation?: () => void;
  messageDisappearAfterMinutes?: number;
  onDisappearSettingChange?: (minutes: MessageDisappearAfterMinutes) => void;
};

/** Liste + empty state : content page + état modal + callback pour ouvrir la modale de choix (direct/groupe) */
export type MessagesContentProps = MessagesPageContent & {
  modalOpen: boolean;
  setModalOpen: (open: boolean) => void;
  onOpenCreateConversation?: () => void;
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
};

/** Header thread : slice conversation du content [id] */
export type MessageIdHeaderProps = Pick<MessageIdPageContent, "conversation">;

/** Thread = content [id] + option affichage header + clé cache SWR (invalidation après mutation). */
export type MessageThreadProps = MessageIdPageContent & {
  showHeader?: boolean;
  /** Clé SWR du thread (passée par ThreadWithCache) pour invalidation après delete/update. */
  threadCacheKey?: ThreadCacheKey;
};

/** Bulle = un message + currentUser (slice du content) + option threadCacheKey + readByRecipient pour "Lu". */
export type MessageBubbleProps = Pick<MessageIdPageContent, "currentUserId"> & {
  message: Message;
  threadCacheKey?: ThreadCacheKey;
  /** true si l'autre participant a lu ce message (affiche "Lu" sur mes messages envoyés). */
  readByRecipient?: boolean;
};
