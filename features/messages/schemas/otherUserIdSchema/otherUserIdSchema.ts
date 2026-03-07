import { z } from "zod";

/** Valide l'id utilisateur pour findOrCreateConversation (donnée externe si passé depuis le client). */
export const otherUserIdSchema = z.string().uuid("ID utilisateur invalide").trim();

export type OtherUserIdSchemaOutput = z.output<typeof otherUserIdSchema>;
