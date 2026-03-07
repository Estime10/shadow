"use server";

import { revalidatePath } from "next/cache";
import { PATHS } from "@/lib/config/paths";
import { updateMessage } from "@/lib/supabase/CRUD";
import { getFirstZodError } from "@/lib/utils/getFirstZodError";
import { parseUpdateMessageFormData } from "@/features/messages/schemas";

export async function updateMessageAction(formData: FormData): Promise<{ error: string | null }> {
  const parsed = parseUpdateMessageFormData(formData);
  if (!parsed.success) return { error: getFirstZodError(parsed) };

  const { messageId, text, conversationId } = parsed.data;
  const { error } = await updateMessage(messageId, text);
  if (error) return { error };

  revalidatePath(PATHS.MESSAGES);
  if (conversationId) revalidatePath(PATHS.messageConversation(conversationId));
  return { error: null };
}
