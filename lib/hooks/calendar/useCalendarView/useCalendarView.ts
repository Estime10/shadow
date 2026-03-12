"use client";

import { useState, useMemo, useCallback } from "react";
import useSWR from "swr";
import { useToast } from "@/lib/contexts/ToastContext/ToastContext";
import { createEventAction, getCalendarEventsAction } from "@/features/calendar/actions";
import type { CalendarEvent } from "@/features/calendar/types";
import {
  filterEventsByMonth,
  filterEventsByDay,
  filterEventsFromToday,
  sortEventsByDate,
  getEventsCountByDay,
} from "@/features/calendar/utils";

const CALENDAR_EVENTS_KEY = "calendar-events";

export type CalendarViewState = {
  now: Date;
  current: { year: number; month: number };
  eventsInMonth: CalendarEvent[];
  eventsByDay: Map<string, number>;
  dayModalOpen: boolean;
  dayModalDate: Date | null;
  eventsForDayModalDate: CalendarEvent[];
  modalOpen: boolean;
  selectedDate: Date | null;
  viewModalOpen: boolean;
  viewEvent: CalendarEvent | null;
};

export type CalendarViewActions = {
  handleDayClick: (date: Date) => void;
  openAddEventFromDay: () => void;
  handleAddEvent: (event: CalendarEvent) => void;
  handlePrev: () => void;
  handleNext: () => void;
  handleEventClick: (event: CalendarEvent) => void;
  closeDayModal: () => void;
  closeAddModal: () => void;
  closeViewModal: () => void;
  handleEventDeleted: () => void;
  handleEventUpdated: () => void;
};

export type UseCalendarViewReturn = CalendarViewState & CalendarViewActions;

export function useCalendarView(initialEvents: CalendarEvent[]): UseCalendarViewReturn {
  const now = new Date();
  const { addToast } = useToast();
  const { data, mutate } = useSWR<CalendarEvent[]>(CALENDAR_EVENTS_KEY, getCalendarEventsAction, {
    fallbackData: initialEvents,
  });
  const events = data ?? initialEvents;

  const [current, setCurrent] = useState({
    year: now.getFullYear(),
    month: now.getMonth(),
  });
  const [dayModalOpen, setDayModalOpen] = useState(false);
  const [dayModalDate, setDayModalDate] = useState<Date | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [viewEvent, setViewEvent] = useState<CalendarEvent | null>(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);

  const eventsInMonth = useMemo(() => {
    const inMonth = filterEventsByMonth(events, current.year, current.month);
    const fromToday = filterEventsFromToday(inMonth, new Date());
    return sortEventsByDate(fromToday);
  }, [events, current.year, current.month]);

  const eventsByDay = useMemo(
    () => getEventsCountByDay(filterEventsByMonth(events, current.year, current.month)),
    [events, current.year, current.month]
  );

  const handleDayClick = useCallback((date: Date) => {
    const normalized = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    setDayModalDate(normalized);
    setDayModalOpen(true);
  }, []);

  const closeDayModal = useCallback(() => {
    setDayModalOpen(false);
    setDayModalDate(null);
  }, []);

  const openAddEventFromDay = useCallback(() => {
    if (!dayModalDate) return;
    setSelectedDate(dayModalDate);
    setDayModalOpen(false);
    setDayModalDate(null);
    setModalOpen(true);
  }, [dayModalDate]);

  const eventsForDayModalDate = useMemo(
    () => (dayModalDate ? sortEventsByDate(filterEventsByDay(events, dayModalDate)) : []),
    [events, dayModalDate]
  );

  const handleAddEvent = useCallback(
    async (event: CalendarEvent) => {
      const { error } = await createEventAction({
        title: event.title,
        description: event.description,
        eventDate: event.eventDate,
      });
      if (!error) {
        void mutate();
        addToast("success", "Événement créé");
      }
    },
    [mutate, addToast]
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

  const handleEventDeleted = useCallback(() => {
    setViewModalOpen(false);
    void mutate();
  }, [mutate]);

  const handleEventUpdated = useCallback(() => {
    void mutate();
  }, [mutate]);

  return {
    now,
    current,
    eventsInMonth,
    eventsByDay,
    dayModalOpen,
    dayModalDate,
    eventsForDayModalDate,
    modalOpen,
    selectedDate,
    viewModalOpen,
    viewEvent,
    handleDayClick,
    openAddEventFromDay,
    handleAddEvent,
    handlePrev,
    handleNext,
    handleEventClick,
    closeDayModal,
    closeAddModal,
    closeViewModal,
    handleEventDeleted,
    handleEventUpdated,
  };
}
