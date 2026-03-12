import { z } from "zod";
import { getFormDataRaw } from "@/lib/utils/getFormDataRaw";
import { MAX_MESSAGE_LENGTH } from "@/features/messages/constants";

const CREATE_MESSAGE_KEYS = ["conversationId", "text", "mediaPath", "mediaType"] as const;

const mediaTypeSchema = z.enum(["image", "video"]);

const createMessageRawSchema = z
  .object({
    conversationId: z
      .string({ message: "Conversation manquante" })
      .uuid("ID conversation invalide")
      .transform((s) => s.trim()),
    text: z
      .union([z.string(), z.null()])
      .transform((s) => (s != null ? String(s).trim() : ""))
      .pipe(z.string().max(MAX_MESSAGE_LENGTH, "Message trop long"))
      .optional()
      .default(""),
    mediaPath: z
      .string()
      .trim()
      .optional()
      .nullable()
      .transform((v) => v ?? undefined),
    mediaType: mediaTypeSchema
      .optional()
      .nullable()
      .transform((v) => v ?? undefined),
  })
  .refine(
    (data) =>
      (data.mediaPath != null && data.mediaPath !== "") ||
      (data.text != null && data.text.length > 0),
    { message: "Message vide ou média requis", path: ["text"] }
  )
  .refine(
    (data) => {
      if (data.mediaPath != null && data.mediaPath !== "") return data.mediaType != null;
      return true;
    },
    { message: "Type média requis avec mediaPath", path: ["mediaType"] }
  );

/**
 * Parse FormData pour createMessageAction.
 * Toute donnée externe (formData) doit être validée avant usage.
 */
export function parseCreateMessageFormData(formData: FormData) {
  return createMessageRawSchema.safeParse(getFormDataRaw(formData, CREATE_MESSAGE_KEYS));
}

export type CreateMessageSchemaOutput = z.output<typeof createMessageRawSchema>;
