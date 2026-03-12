"use server";

import { revalidatePath } from "next/cache";
import { PATHS } from "@/lib/config/paths";
import { createMessage } from "@/lib/supabase/CRUD";
import { getFirstZodError } from "@/lib/utils/getFirstZodError";
import { parseCreateMessageFormData } from "@/features/messages/schemas";

export async function createMessageAction(formData: FormData): Promise<{ error: string | null }> {
  const parsed = parseCreateMessageFormData(formData);
  if (!parsed.success) return { error: getFirstZodError(parsed) };

  const { conversationId, text, mediaPath, mediaType } = parsed.data;
  const media =
    mediaPath != null && mediaPath !== "" && mediaType != null
      ? { mediaPath, mediaType }
      : undefined;
  const { error } = await createMessage(conversationId, text ?? "", media);
  if (error) return { error };

  revalidatePath(PATHS.MESSAGES);
  revalidatePath(PATHS.messageConversation(conversationId));
  return { error: null };
}
