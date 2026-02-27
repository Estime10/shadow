"use server";

import { getConversationWithMessages, getRoomConversation } from "@/features/messages/data";
import { ROOM_CONVERSATION_ID } from "@/lib/supabase/CRUD";
import type { MessageIdPageContent } from "@/features/messages/types";

export type GetThreadDataArgs = {
  conversationId: string;
  withUserId?: string | null;
};

/**
 * Données pour la page thread (conversation + messages).
 * Utilisé par SWR côté client. Gère conversation classique et room.
 */
export async function getThreadDataAction(
  args: GetThreadDataArgs
): Promise<MessageIdPageContent | null> {
  const { conversationId, withUserId } = args;
  if (conversationId === ROOM_CONVERSATION_ID) {
    return getRoomConversation(withUserId ?? null);
  }
  return getConversationWithMessages(conversationId);
}
