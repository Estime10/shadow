/**
 * Formate une date ISO en chaîne relative (aujourd'hui = heure, hier = "Hier", sinon date).
 * Une fonction = un sous-dossier. Exportée via lib/functions/index.ts (seul index du projet pour les fonctions).
 */
export function formatRelativeTime(iso: string): string {
  const d = new Date(iso);
  const today = new Date();
  const isToday = d.toDateString() === today.toDateString();
  if (isToday) {
    return d.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
  }
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  if (d.toDateString() === yesterday.toDateString()) {
    return "Hier";
  }
  return d.toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit" });
}
