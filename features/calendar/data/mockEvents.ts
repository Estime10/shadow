import type { CalendarEvent } from "@/features/calendar/types";

/**
 * Données factices pour l’UI du calendrier (à remplacer par Supabase plus tard).
 * Dates fixes pour éviter le hydration mismatch (pas de new Date() à l’évaluation).
 */
export const MOCK_EVENTS: CalendarEvent[] = [
  {
    id: "1",
    title: "Réunion équipe",
    description: "Point hebdo et priorités de la semaine.",
    eventDate: "2026-03-06T16:00:00.000Z",
    createdBy: "user-1",
    createdAt: "2026-03-01T12:00:00.000Z",
  },
  {
    id: "2",
    title: "Anniversaire Léa",
    description: null,
    eventDate: "2026-03-09T19:00:00.000Z",
    createdBy: "user-1",
    createdAt: "2026-03-01T12:00:00.000Z",
  },
  {
    id: "3",
    title: "Livraison colis",
    description: "Créneau 14h–18h.",
    eventDate: "2026-03-13T14:00:00.000Z",
    createdBy: "user-1",
    createdAt: "2026-03-01T12:00:00.000Z",
  },
  {
    id: "4",
    title: "Sport",
    description: "Session running 45 min.",
    eventDate: "2026-03-07T18:30:00.000Z",
    createdBy: "user-1",
    createdAt: "2026-03-01T12:00:00.000Z",
  },
  {
    id: "5",
    title: "Dentiste",
    description: null,
    eventDate: "2026-03-11T09:00:00.000Z",
    createdBy: "user-1",
    createdAt: "2026-03-01T12:00:00.000Z",
  },
  {
    id: "6",
    title: "Apéro équipe",
    description: "Bar du coin, 19h.",
    eventDate: "2026-03-16T19:00:00.000Z",
    createdBy: "user-1",
    createdAt: "2026-03-01T12:00:00.000Z",
  },
  {
    id: "7",
    title: "Formation",
    description: "Webinaire React avancé.",
    eventDate: "2026-03-20T10:00:00.000Z",
    createdBy: "user-1",
    createdAt: "2026-03-01T12:00:00.000Z",
  },
  {
    id: "8",
    title: "Week-end",
    description: "Résa train 08h.",
    eventDate: "2026-03-26T08:00:00.000Z",
    createdBy: "user-1",
    createdAt: "2026-03-01T12:00:00.000Z",
  },
];
