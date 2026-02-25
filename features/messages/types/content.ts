import type { Conversation, Message } from "@/types/message";
import type { Profile } from "@/lib/supabase/CRUD";

/**
 * Contenu que la page liste (/messages) récupère (use server) et passe au feature.
 * Source unique de vérité pour la page messages.
 */
export type MessagesPageContent = {
  conversations: Conversation[];
  currentUserId: string | null;
  profiles: Profile[];
};

/**
 * Contenu que la page thread (/messages/[id]) récupère (use server) et passe au feature.
 * Source unique de vérité pour la page conversation.
 */
export type MessageIdPageContent = {
  conversation: Conversation;
  messages: Message[];
  currentUserId: string | null;
};
