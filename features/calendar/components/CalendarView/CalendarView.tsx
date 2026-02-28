"use client";

import { useState, useMemo, useCallback } from "react";
import { MonthNav } from "../MonthNav/MonthNav";
import { MonthGrid } from "../MonthGrid/MonthGrid";
import { EventCarousel } from "../EventCarousel/EventCarousel";
import { AddEventModal } from "../AddEventModal/AddEventModal";
import { EventDetailModal } from "../EventDetailModal/EventDetailModal";
import { MOCK_EVENTS } from "@/features/calendar/data/mockEvents";
import type { CalendarEvent } from "@/features/calendar/types";
import {
  filterEventsByMonth,
  sortEventsByDate,
  getEventsCountByDay,
} from "@/features/calendar/utils";

export function CalendarView() {
  const now = new Date();
  const [events, setEvents] = useState<CalendarEvent[]>(MOCK_EVENTS);
  const [current, setCurrent] = useState({ year: now.getFullYear(), month: now.getMonth() });
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [viewEvent, setViewEvent] = useState<CalendarEvent | null>(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);

  const eventsInMonth = useMemo(
    () => sortEventsByDate(filterEventsByMonth(events, current.year, current.month)),
    [events, current.year, current.month]
  );

  const eventsByDay = useMemo(
    () => getEventsCountByDay(filterEventsByMonth(events, current.year, current.month)),
    [events, current.year, current.month]
  );

  const handleDayClick = useCallback((date: Date) => {
    setSelectedDate(new Date(date.getFullYear(), date.getMonth(), date.getDate()));
    setModalOpen(true);
  }, []);

  const handleAddEvent = useCallback(
    (event: CalendarEvent) => {
      setEvents((prev) => [...prev, event]);
    },
    [setEvents]
  );

  const handlePrev = () => {
    setCurrent((prev) => {
      if (prev.month === 0) return { year: prev.year - 1, month: 11 };
      return { year: prev.year, month: prev.month - 1 };
    });
  };

  const handleNext = () => {
    setCurrent((prev) => {
      if (prev.month === 11) return { year: prev.year + 1, month: 0 };
      return { year: prev.year, month: prev.month + 1 };
    });
  };

  const handleEventClick = useCallback((event: CalendarEvent) => {
    setViewEvent(event);
    setViewModalOpen(true);
  }, []);

  return (
    <div className="flex flex-1 flex-col min-h-0">
      {/* Mobile : calendrier limité à ~50% de la hauteur */}
      <section className="shrink-0 max-h-[50vh] lg:max-h-none flex flex-col min-h-0">
        <MonthNav
          year={current.year}
          month={current.month}
          onPrev={handlePrev}
          onNext={handleNext}
        />
        <MonthGrid
          year={current.year}
          month={current.month}
          today={now}
          eventsByDay={eventsByDay}
          onDayClick={handleDayClick}
        />
      </section>
      <section className="flex-1 min-h-0 flex flex-col" aria-label="Événements du mois">
        <h2 className="content-px pt-4 font-display text-sm font-bold uppercase tracking-wider text-(--text-muted)">
          Événements
        </h2>
        <EventCarousel events={eventsInMonth} onEventClick={handleEventClick} />
      </section>
      <EventDetailModal
        open={viewModalOpen}
        onClose={() => setViewModalOpen(false)}
        event={viewEvent}
      />
      {selectedDate && (
        <AddEventModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          selectedDate={selectedDate}
          onSubmit={handleAddEvent}
        />
      )}
    </div>
  );
}
