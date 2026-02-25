import type { Conversation, Message } from "@/types/message";
import type { Profile } from "@/lib/supabase/CRUD";

/**
 * Contrat d’entrée du feature messages : ce que les pages fournissent.
 * Les pages (app) importent ces types et passent les données ; les composants ne définissent pas de types en doublon.
 */
export type MessagesPageContent = {
  conversations: Conversation[];
  currentUserId: string | null;
  profiles: Profile[];
};

/** Contenu page thread /messages/[id] */
export type MessageIdPageContent = {
  conversation: Conversation;
  messages: Message[];
  currentUserId: string | null;
};
