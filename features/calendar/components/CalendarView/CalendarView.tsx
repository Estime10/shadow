"use client";

import { useCalendarView } from "@/lib/hooks/calendar";
import type { CalendarEvent } from "@/features/calendar/types";
import { CalendarViewEventsSection } from "./CalendarViewEventsSection/CalendarViewEventsSection";
import { CalendarViewMonthSection } from "./CalendarViewMonthSection/CalendarViewMonthSection";
import { CalendarViewModals } from "./CalendarViewModals/CalendarViewModals";

export type CalendarViewProps = {
  initialEvents: CalendarEvent[];
};

export function CalendarView({ initialEvents }: CalendarViewProps) {
  const calendar = useCalendarView(initialEvents);

  return (
    <div className="flex flex-1 flex-col min-h-0">
      <CalendarViewMonthSection
        year={calendar.current.year}
        month={calendar.current.month}
        today={calendar.now}
        eventsByDay={calendar.eventsByDay}
        onPrev={calendar.handlePrev}
        onNext={calendar.handleNext}
        onDayClick={calendar.handleDayClick}
      />
      <CalendarViewEventsSection
        events={calendar.eventsInMonth}
        onEventClick={calendar.handleEventClick}
      />
      <CalendarViewModals
        viewModalOpen={calendar.viewModalOpen}
        viewEvent={calendar.viewEvent}
        closeViewModal={calendar.closeViewModal}
        handleEventDeleted={calendar.handleEventDeleted}
        handleEventUpdated={calendar.handleEventUpdated}
        modalOpen={calendar.modalOpen}
        selectedDate={calendar.selectedDate}
        closeAddModal={calendar.closeAddModal}
        handleAddEvent={calendar.handleAddEvent}
      />
    </div>
  );
}
