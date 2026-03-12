import { MONTH_LABELS } from "@/features/calendar/constants";

/**
 * Utilitaires dates pour le calendrier (mois, grille, même jour).
 */

/** Ex. "24 Février 2026" pour l’affichage dans les modales. */
export function formatDateLabel(date: Date): string {
  return `${date.getDate()} ${MONTH_LABELS[date.getMonth()]} ${date.getFullYear()}`;
}

export function getStartOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

export function getEndOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
}

/** Lundi = 0. Dimanche = 6. */
export function getWeekday(date: Date): number {
  const d = date.getDay();
  return d === 0 ? 6 : d - 1;
}

/**
 * Jours à afficher dans la grille du mois : du lundi de la première semaine
 * au dimanche de la dernière semaine (éventuellement jours du mois précédant/suivant).
 */
export function getMonthGridDays(year: number, month: number): Date[] {
  const first = new Date(year, month, 1);
  const last = new Date(year, month + 1, 0);
  const startWeekday = getWeekday(first);
  const start = new Date(first);
  start.setDate(start.getDate() - startWeekday);
  const days: Date[] = [];
  const cursor = new Date(start);
  const endDate = new Date(last);
  endDate.setDate(endDate.getDate() + (6 - getWeekday(last)));
  while (cursor <= endDate) {
    days.push(new Date(cursor));
    cursor.setDate(cursor.getDate() + 1);
  }
  return days;
}

export function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function isCurrentMonth(date: Date, year: number, month: number): boolean {
  return date.getFullYear() === year && date.getMonth() === month;
}

export function toDateOnlyISO(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
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
