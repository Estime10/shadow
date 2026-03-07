"use server";

import { revalidatePath } from "next/cache";
import { PATHS } from "@/lib/config/paths";
import { createGroupConversation } from "@/lib/supabase/CRUD";
import { getFirstZodError } from "@/lib/utils/getFirstZodError";
import { parseCreateGroupPayload } from "@/features/messages/schemas";

export async function createGroupConversationAction(
  participantIds: string[]
): Promise<{ conversationId: string; error: string | null }> {
  const parsed = parseCreateGroupPayload({ participantIds });
  if (!parsed.success) return { conversationId: "", error: getFirstZodError(parsed) };

  const result = await createGroupConversation(parsed.data.participantIds);
  if (result.error) return result;

  revalidatePath(PATHS.MESSAGES);
  revalidatePath(PATHS.messageConversation(result.conversationId));
  return result;
}
