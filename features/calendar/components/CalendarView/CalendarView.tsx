"use client";

import { MonthNav } from "../MonthNav/MonthNav";
import { MonthGrid } from "../MonthGrid/MonthGrid";
import { EventCarousel } from "../EventCarousel/EventCarousel";
import { AddEventModal } from "../AddEventModal/AddEventModal";
import { EventDetailModal } from "../EventDetailModal/EventDetailModal";
import { useCalendarView } from "@/lib/hooks/calendar/useCalendarView";

export function CalendarView() {
  const {
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
  } = useCalendarView();

  return (
    <div className="flex flex-1 flex-col min-h-0">
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
      <EventDetailModal open={viewModalOpen} onClose={closeViewModal} event={viewEvent} />
      {selectedDate && (
        <AddEventModal
          open={modalOpen}
          onClose={closeAddModal}
          selectedDate={selectedDate}
          onSubmit={handleAddEvent}
        />
      )}
    </div>
  );
}
