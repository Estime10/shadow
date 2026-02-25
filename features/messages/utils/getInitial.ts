/**
 * Retourne l'initiale pour l'affichage (avatar, liste).
 * Gère null/vide pour éviter les erreurs d'affichage.
 */
export function getInitial(value: string | null | undefined): string {
  if (value == null || value.length === 0) return "?";
  return value.slice(0, 1).toUpperCase();
}
