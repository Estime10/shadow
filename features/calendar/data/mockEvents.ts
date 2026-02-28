import type { CalendarEvent } from "@/features/calendar/types";

/**
 * Données factices pour l’UI du calendrier (à remplacer par Supabase plus tard).
 */
export const MOCK_EVENTS: CalendarEvent[] = [
  {
    id: "1",
    title: "Réunion équipe",
    description: "Point hebdo et priorités de la semaine.",
    eventDate: new Date().toISOString(),
    createdBy: "user-1",
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    title: "Anniversaire Léa",
    description: null,
    eventDate: (() => {
      const d = new Date();
      d.setDate(d.getDate() + 3);
      d.setHours(19, 0, 0, 0);
      return d.toISOString();
    })(),
    createdBy: "user-1",
    createdAt: new Date().toISOString(),
  },
  {
    id: "3",
    title: "Livraison colis",
    description: "Créneau 14h–18h.",
    eventDate: (() => {
      const d = new Date();
      d.setDate(d.getDate() + 7);
      d.setHours(14, 0, 0, 0);
      return d.toISOString();
    })(),
    createdBy: "user-1",
    createdAt: new Date().toISOString(),
  },
  {
    id: "4",
    title: "Sport",
    description: "Session running 45 min.",
    eventDate: (() => {
      const d = new Date();
      d.setDate(d.getDate() + 1);
      d.setHours(18, 30, 0, 0);
      return d.toISOString();
    })(),
    createdBy: "user-1",
    createdAt: new Date().toISOString(),
  },
  {
    id: "5",
    title: "Dentiste",
    description: null,
    eventDate: (() => {
      const d = new Date();
      d.setDate(d.getDate() + 5);
      d.setHours(9, 0, 0, 0);
      return d.toISOString();
    })(),
    createdBy: "user-1",
    createdAt: new Date().toISOString(),
  },
  {
    id: "6",
    title: "Apéro équipe",
    description: "Bar du coin, 19h.",
    eventDate: (() => {
      const d = new Date();
      d.setDate(d.getDate() + 10);
      d.setHours(19, 0, 0, 0);
      return d.toISOString();
    })(),
    createdBy: "user-1",
    createdAt: new Date().toISOString(),
  },
  {
    id: "7",
    title: "Formation",
    description: "Webinaire React avancé.",
    eventDate: (() => {
      const d = new Date();
      d.setDate(d.getDate() + 14);
      d.setHours(10, 0, 0, 0);
      return d.toISOString();
    })(),
    createdBy: "user-1",
    createdAt: new Date().toISOString(),
  },
  {
    id: "8",
    title: "Week-end",
    description: "Résa train 08h.",
    eventDate: (() => {
      const d = new Date();
      d.setDate(d.getDate() + 20);
      d.setHours(8, 0, 0, 0);
      return d.toISOString();
    })(),
    createdBy: "user-1",
    createdAt: new Date().toISOString(),
  },
];
