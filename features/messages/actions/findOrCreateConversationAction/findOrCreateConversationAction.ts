"use server";

import { findOrCreateConversation } from "@/lib/supabase/CRUD";

export async function findOrCreateConversationAction(
  otherUserId: string
): Promise<{ conversationId: string; error: string | null }> {
  return findOrCreateConversation(otherUserId);
}
