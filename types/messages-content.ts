import type { Conversation, Message } from "./message";
import type { Profile } from "./profile";

/**
 * Contrat d'entrée du feature messages : ce que les pages fournissent.
 */
export type MessagesPageContent = {
  conversations: Conversation[];
  currentUserId: string | null;
  profiles: Profile[];
  messageDisappearAfterMinutes?: number;
};

/** Contenu page thread /messages/[id]. */
export type MessageIdPageContent = {
  conversation: Conversation;
  messages: Message[];
  currentUserId: string | null;
  readMessageIds: string[];
};
