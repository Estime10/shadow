/**
 * Événement calendrier (aligné avec public.events).
 * createdBy / createdAt servent pour l’affichage et le partage plus tard.
 */
export type CalendarEvent = {
  id: string;
  title: string;
  description: string | null;
  eventDate: string; // ISO date-time
  createdBy: string;
  createdAt: string; // ISO
};
