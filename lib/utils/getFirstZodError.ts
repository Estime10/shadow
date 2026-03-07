import type { z } from "zod";

const DEFAULT_MESSAGE = "Données invalides";

type FailedParseResult = { success: false; error: z.ZodError };

/**
 * Extrait le premier message d'erreur d'un résultat Zod safeParse en échec.
 * Priorité : formErrors[0], puis première erreur de champ (fieldErrors), sinon message par défaut.
 * Utilisé par les server actions pour renvoyer une erreur utilisateur unique.
 */
export function getFirstZodError(result: FailedParseResult): string {
  const flat = result.error.flatten();
  if (flat.formErrors.length > 0) {
    const msg = flat.formErrors[0];
    return typeof msg === "string" ? msg : DEFAULT_MESSAGE;
  }
  const firstField = Object.values(flat.fieldErrors).flat();
  const msg = firstField[0];
  return typeof msg === "string" ? msg : DEFAULT_MESSAGE;
}
