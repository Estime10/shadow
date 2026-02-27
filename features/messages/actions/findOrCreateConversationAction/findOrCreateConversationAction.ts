"use server";

import { findOrCreateConversation } from "@/lib/supabase/CRUD";
import { otherUserIdSchema } from "@/features/messages/schemas";

export async function findOrCreateConversationAction(
  otherUserId: string
): Promise<{ conversationId: string; error: string | null }> {
  const parsed = otherUserIdSchema.safeParse(otherUserId);
  if (!parsed.success) {
    const message = parsed.error.flatten().formErrors[0] ?? "Données invalides";
    return { conversationId: "", error: message };
  }
  return findOrCreateConversation(parsed.data);
}
