import { MONTH_LABELS } from "@/features/calendar/constants";

/**
 * Formatage d'affichage des dates/heures pour le calendrier (modales, cartes).
 * SRP : pas de calcul de grille ici.
 */

/** Ex. "24 Février 2026" pour l'affichage dans les modales. */
export function formatDateLabel(date: Date): string {
  return `${date.getDate()} ${MONTH_LABELS[date.getMonth()]} ${date.getFullYear()}`;
}

/** Affiche l'heure (HH:MM) à partir d'une ISO string. */
export function formatEventTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
}

/** Affiche le jour et l'heure (ex. "15 mars, 14h00") pour les cartes d'événement. */
export function formatEventDayTime(iso: string): string {
  const d = new Date(iso);
  const day = d.toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
  const time = formatEventTime(iso);
  return `${day}, ${time}`;
}

/** Affiche date + heure (ex. "24 févr. 2026 à 14:00"). */
export function formatEventDateTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
