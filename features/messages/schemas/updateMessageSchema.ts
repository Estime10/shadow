import { z } from "zod";
import { MAX_MESSAGE_LENGTH } from "@/features/messages/constants";

const updateMessageRawSchema = z.object({
  messageId: z.string().min(1, "Message manquant").trim(),
  conversationId: z
    .union([z.string(), z.null()])
    .optional()
    .transform((s) => (s && s.trim()) || undefined),
  text: z.string().min(1, "Message vide").max(MAX_MESSAGE_LENGTH, "Message trop long").trim(),
});

/**
 * Parse FormData pour updateMessageAction.
 */
export function parseUpdateMessageFormData(formData: FormData) {
  const raw = {
    messageId: formData.get("messageId"),
    conversationId: formData.get("conversationId"),
    text: formData.get("text"),
  };
  return updateMessageRawSchema.safeParse(raw);
}

export type UpdateMessageSchemaOutput = z.output<typeof updateMessageRawSchema>;
