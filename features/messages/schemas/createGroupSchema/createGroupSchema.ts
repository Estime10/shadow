import { z } from "zod";

const createGroupRawSchema = z.object({
  participantIds: z
    .array(z.string().uuid("ID invalide"))
    .min(2, "Sélectionnez au moins 2 participants"),
});

/**
 * Valide les données pour createGroupConversationAction.
 * participantIds = les autres utilisateurs à inviter (le créateur est ajouté côté serveur).
 */
export function parseCreateGroupPayload(payload: { participantIds: string[] }) {
  return createGroupRawSchema.safeParse(payload);
}

export type CreateGroupSchemaOutput = z.output<typeof createGroupRawSchema>;
