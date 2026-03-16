"use server";

import { revalidatePath } from "next/cache";
import { PATHS } from "@/lib/config/paths";
import { createMessage } from "@/lib/supabase/CRUD";
import { getFirstZodError } from "@/lib/utils/getFirstZodError";
import { getClientIdentifier, isRateLimited, RATE_LIMIT_MESSAGE } from "@/lib/rateLimit";
import { parseCreateMessageFormData } from "@/features/messages/schemas";

const CREATE_MESSAGE_RATE_LIMIT = 100; // messages par 15 min et par IP

export async function createMessageAction(formData: FormData): Promise<{ error: string | null }> {
  const identifier = await getClientIdentifier();
  const key = `messages:create:${identifier}`;
  if (isRateLimited(key, CREATE_MESSAGE_RATE_LIMIT)) {
    return { error: RATE_LIMIT_MESSAGE };
  }

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
