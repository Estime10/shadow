import { z } from "zod";
import { getFormDataRaw } from "@/lib/utils/getFormDataRaw";

const DELETE_MESSAGE_KEYS = ["messageId", "conversationId"] as const;

const deleteMessageRawSchema = z.object({
  messageId: z.string().uuid("ID message invalide").trim(),
  conversationId: z
    .union([z.string().uuid("ID conversation invalide"), z.null()])
    .optional()
    .transform((s) => (s && typeof s === "string" && s.trim() ? s.trim() : undefined)),
});

/**
 * Parse FormData pour deleteMessageAction.
 */
export function parseDeleteMessageFormData(formData: FormData) {
  return deleteMessageRawSchema.safeParse(getFormDataRaw(formData, DELETE_MESSAGE_KEYS));
}

export type DeleteMessageSchemaOutput = z.output<typeof deleteMessageRawSchema>;
