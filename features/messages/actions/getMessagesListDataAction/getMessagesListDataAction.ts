"use server";

import { getConversationsForList } from "@/features/messages/data";
import { getAllProfiles } from "@/lib/supabase/CRUD";
import type { MessagesPageContent } from "@/features/messages/types";

/**
 * Données pour la page liste messages (conversations + profils).
 * Utilisé par SWR côté client pour refetch / cache.
 */
export async function getMessagesListDataAction(): Promise<MessagesPageContent> {
  const [{ conversations, currentUserId }, profiles] = await Promise.all([
    getConversationsForList(),
    getAllProfiles(),
  ]);
  return { conversations, currentUserId, profiles };
}
