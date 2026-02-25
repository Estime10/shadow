/**
 * Retourne l'initiale pour l'affichage d'un profil (username ou "?").
 */
export function getInitial(username: string | null): string {
  if (!username || username.length === 0) return "?";
  return username.slice(0, 1).toUpperCase();
}
