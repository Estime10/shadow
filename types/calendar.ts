/**
 * Événement calendrier (aligné avec public.events).
 */
export type CalendarEvent = {
  id: string;
  title: string;
  description: string | null;
  eventDate: string; // ISO date-time
  createdBy: string;
  createdAt: string; // ISO
};
