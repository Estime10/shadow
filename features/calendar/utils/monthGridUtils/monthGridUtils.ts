/**
 * Utilitaires grille de mois et calculs de dates (calendrier).
 * SRP : pas de formatage d'affichage ici.
 */

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
