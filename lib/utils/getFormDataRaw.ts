/**
 * Extrait un sous-ensemble de champs d'un FormData en objet brut.
 * Évite la répétition des formData.get("key") dans chaque schéma.
 * Les schémas Zod font ensuite safeParse(getFormDataRaw(formData, keys)).
 */
export function getFormDataRaw(
  formData: FormData,
  keys: readonly string[]
): Record<string, FormDataEntryValue | null> {
  const raw: Record<string, FormDataEntryValue | null> = {};
  for (const key of keys) {
    raw[key] = formData.get(key);
  }
  return raw;
}
