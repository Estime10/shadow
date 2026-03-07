"use server";

import { findOrCreateConversation } from "@/lib/supabase/CRUD";
import { getFirstZodError } from "@/lib/utils/getFirstZodError";
import { otherUserIdSchema } from "@/features/messages/schemas";

export async function findOrCreateConversationAction(
  otherUserId: string
): Promise<{ conversationId: string; error: string | null }> {
  const parsed = otherUserIdSchema.safeParse(otherUserId);
  if (!parsed.success) return { conversationId: "", error: getFirstZodError(parsed) };
  return findOrCreateConversation(parsed.data);
}
