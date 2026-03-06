"use client";

import { useState, useMemo, useCallback } from "react";
import { MOCK_EVENTS } from "@/features/calendar/data/mockEvents";
import type { CalendarEvent } from "@/features/calendar/types";
import {
  filterEventsByMonth,
  sortEventsByDate,
  getEventsCountByDay,
} from "@/features/calendar/utils";

export type CalendarViewState = {
  now: Date;
  current: { year: number; month: number };
  eventsInMonth: CalendarEvent[];
  eventsByDay: Map<string, number>;
  modalOpen: boolean;
  selectedDate: Date | null;
  viewModalOpen: boolean;
  viewEvent: CalendarEvent | null;
};

export type CalendarViewActions = {
  handleDayClick: (date: Date) => void;
  handleAddEvent: (event: CalendarEvent) => void;
  handlePrev: () => void;
  handleNext: () => void;
  handleEventClick: (event: CalendarEvent) => void;
  closeAddModal: () => void;
  closeViewModal: () => void;
};

export type UseCalendarViewReturn = CalendarViewState & CalendarViewActions;

export function useCalendarView(): UseCalendarViewReturn {
  const now = new Date();
  const [events, setEvents] = useState<CalendarEvent[]>(MOCK_EVENTS);
  const [current, setCurrent] = useState({
    year: now.getFullYear(),
    month: now.getMonth(),
  });
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

  const handlePrev = useCallback(() => {
    setCurrent((prev) => {
      if (prev.month === 0) return { year: prev.year - 1, month: 11 };
      return { year: prev.year, month: prev.month - 1 };
    });
  }, []);

  const handleNext = useCallback(() => {
    setCurrent((prev) => {
      if (prev.month === 11) return { year: prev.year + 1, month: 0 };
      return { year: prev.year, month: prev.month + 1 };
    });
  }, []);

  const handleEventClick = useCallback((event: CalendarEvent) => {
    setViewEvent(event);
    setViewModalOpen(true);
  }, []);

  const closeAddModal = useCallback(() => {
    setModalOpen(false);
  }, []);

  const closeViewModal = useCallback(() => {
    setViewModalOpen(false);
  }, []);

  return {
    now,
    current,
    eventsInMonth,
    eventsByDay,
    modalOpen,
    selectedDate,
    viewModalOpen,
    viewEvent,
    handleDayClick,
    handleAddEvent,
    handlePrev,
    handleNext,
    handleEventClick,
    closeAddModal,
    closeViewModal,
  };
}
