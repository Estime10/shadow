import type { Conversation, Message } from "@/types/message";

/**
 * Contenu que l'app envoie à la page conversation [id].
 * Typage explicite pour ce que la page récupère et passe au feature.
 */
export type MessageIdPageContent = {
  conversation: Conversation;
  messages: Message[];
};
