import { z } from "zod";
import { getFormDataRaw } from "@/lib/utils/getFormDataRaw";
import { MAX_MESSAGE_LENGTH } from "@/features/messages/constants";

const UPDATE_MESSAGE_KEYS = ["messageId", "conversationId", "text"] as const;

const updateMessageRawSchema = z.object({
  messageId: z.string().uuid("ID message invalide").trim(),
  conversationId: z
    .union([z.string().uuid("ID conversation invalide"), z.null()])
    .optional()
    .transform((s) => (s && typeof s === "string" && s.trim() ? s.trim() : undefined)),
  text: z.string().min(1, "Message vide").max(MAX_MESSAGE_LENGTH, "Message trop long").trim(),
});

/**
 * Parse FormData pour updateMessageAction.
 */
export function parseUpdateMessageFormData(formData: FormData) {
  return updateMessageRawSchema.safeParse(getFormDataRaw(formData, UPDATE_MESSAGE_KEYS));
}

export type UpdateMessageSchemaOutput = z.output<typeof updateMessageRawSchema>;
