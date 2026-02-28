"use server";

import { revalidatePath } from "next/cache";
import { createGroupConversation } from "@/lib/supabase/CRUD";
import { parseCreateGroupPayload } from "@/features/messages/schemas";

export async function createGroupConversationAction(
  participantIds: string[]
): Promise<{ conversationId: string; error: string | null }> {
  const parsed = parseCreateGroupPayload({ participantIds });
  if (!parsed.success) {
    const message = parsed.error.flatten().formErrors[0] ?? "Données invalides";
    return { conversationId: "", error: message };
  }

  const result = await createGroupConversation(parsed.data.participantIds);
  if (result.error) return result;

  revalidatePath("/messages");
  revalidatePath(`/messages/${result.conversationId}`);
  return result;
}
