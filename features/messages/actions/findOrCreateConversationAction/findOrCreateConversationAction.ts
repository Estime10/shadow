"use server";

import { findOrCreateConversation } from "@/lib/supabase/CRUD";
import { otherUserIdSchema } from "@/features/messages/schemas";
import { log, logError } from "@/lib/logger/logger";

export async function findOrCreateConversationAction(
  otherUserId: string
): Promise<{ conversationId: string; error: string | null }> {
  const parsed = otherUserIdSchema.safeParse(otherUserId);
  if (!parsed.success) {
    const message = parsed.error.flatten().formErrors[0] ?? "Données invalides";
    log("conversation", "findOrCreateConversationAction: validation échouée", {
      otherUserId,
      message,
    });
    return { conversationId: "", error: message };
  }
  const result = await findOrCreateConversation(parsed.data);
  if (result.error) {
    logError("conversation", "findOrCreateConversationAction: erreur", result.error);
  } else {
    log("conversation", "findOrCreateConversationAction: ok", {
      conversationId: result.conversationId,
      otherUserId: parsed.data,
    });
  }
  return result;
}
