"use server";

import { revalidatePath } from "next/cache";
import { PATHS } from "@/lib/config/paths";
import { deleteMessage } from "@/lib/supabase/CRUD";
import { getFirstZodError } from "@/lib/utils/getFirstZodError";
import { parseDeleteMessageFormData } from "@/features/messages/schemas";

export async function deleteMessageAction(formData: FormData): Promise<{ error: string | null }> {
  const parsed = parseDeleteMessageFormData(formData);
  if (!parsed.success) return { error: getFirstZodError(parsed) };

  const { messageId, conversationId } = parsed.data;
  const { error } = await deleteMessage(messageId, conversationId ?? null);
  if (error) return { error };

  revalidatePath(PATHS.MESSAGES);
  if (conversationId) revalidatePath(PATHS.messageConversation(conversationId));
  return { error: null };
}
