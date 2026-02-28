"use server";

import { getConversationsForList } from "@/features/messages/data";
import { getAllProfiles, getCurrentUserProfile } from "@/lib/supabase/CRUD";
import type { MessagesPageContent } from "@/features/messages/types";

/**
 * Données pour la page liste messages (conversations + profils + réglage disparition).
 * Utilisé par SWR côté client pour refetch / cache.
 */
export async function getMessagesListDataAction(): Promise<MessagesPageContent> {
  const [{ conversations, currentUserId }, profiles, profile] = await Promise.all([
    getConversationsForList(),
    getAllProfiles(),
    getCurrentUserProfile(),
  ]);
  return {
    conversations,
    currentUserId,
    profiles,
    messageDisappearAfterMinutes: profile?.messageDisappearAfterMinutes ?? 30,
  };
}
