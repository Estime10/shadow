import type { Conversation, Message } from "@/types/message";
import type { Profile } from "@/lib/supabase/CRUD";

/** Props pour MessagesHeader */
export type MessagesHeaderProps = {
  onOpenCreateConversation?: () => void;
};

/** Props pour MessagesContent / MessagesList */
export type MessagesListProps = {
  conversations: Conversation[];
  currentUserId: string | null;
  profiles: Profile[];
  modalOpen: boolean;
  setModalOpen: (open: boolean) => void;
};

/** Props pour ConversationEmptyState */
export type ConversationEmptyStateProps = {
  profiles: Profile[];
  currentUserId: string | null;
  modalOpen: boolean;
  setModalOpen: (open: boolean) => void;
  /** Si true, n'affiche pas le panneau droit (le texte est dans la card Conversations). */
  hidePanel?: boolean;
};

/** Props pour ConversationListItem */
export type ConversationListItemProps = {
  conversation: Conversation;
  isSelected: boolean;
  currentUserId: string | null;
  /** Pour afficher le username de l'expéditeur du dernier message. */
  profiles: Profile[];
};

/** Props pour MessageIdHeader */
export type MessageIdHeaderProps = {
  conversation: Conversation;
};

/** Props pour MessageIdContent (et contenu page [id]) */
export type MessageIdContentProps = {
  conversation: Conversation;
  messages: Message[];
  currentUserId: string | null;
};

/** Props pour MessageThread */
export type MessageThreadProps = {
  conversation: Conversation;
  messages: Message[];
  currentUserId: string | null;
  showHeader?: boolean;
};

/** Props pour MessageBubble */
export type MessageBubbleProps = {
  message: Message;
  currentUserId: string | null;
};
