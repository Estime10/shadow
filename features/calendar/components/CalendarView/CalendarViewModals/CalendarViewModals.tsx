"use client";

import dynamic from "next/dynamic";
import type { CalendarEvent } from "@/features/calendar/types";

const DayEventsModal = dynamic(
  () =>
    import("../../DayEventsModal/DayEventsModal").then((m) => ({
      default: m.DayEventsModal,
    })),
  { ssr: false }
);

const AddEventModal = dynamic(
  () => import("../../AddEventModal/AddEventModal").then((m) => ({ default: m.AddEventModal })),
  { ssr: false }
);

const EventDetailModal = dynamic(
  () =>
    import("../../EventDetailModal/EventDetailModal").then((m) => ({
      default: m.EventDetailModal,
    })),
  { ssr: false }
);

type CalendarViewModalsProps = {
  dayModalOpen: boolean;
  dayModalDate: Date | null;
  eventsForDayModalDate: CalendarEvent[];
  closeDayModal: () => void;
  openAddEventFromDay: () => void;
  onEventClick: (event: CalendarEvent) => void;
  viewModalOpen: boolean;
  viewEvent: CalendarEvent | null;
  closeViewModal: () => void;
  handleEventDeleted: () => void;
  handleEventUpdated: () => void;
  modalOpen: boolean;
  selectedDate: Date | null;
  closeAddModal: () => void;
  handleAddEvent: (event: CalendarEvent) => void;
};

export function CalendarViewModals({
  dayModalOpen,
  dayModalDate,
  eventsForDayModalDate,
  closeDayModal,
  openAddEventFromDay,
  onEventClick,
  viewModalOpen,
  viewEvent,
  closeViewModal,
  handleEventDeleted,
  handleEventUpdated,
  modalOpen,
  selectedDate,
  closeAddModal,
  handleAddEvent,
}: CalendarViewModalsProps) {
  return (
    <>
      <DayEventsModal
        open={dayModalOpen}
        date={dayModalDate}
        events={eventsForDayModalDate}
        onClose={closeDayModal}
        onAddEvent={openAddEventFromDay}
        onEventClick={onEventClick}
      />
      <EventDetailModal
        open={viewModalOpen}
        onClose={closeViewModal}
        event={viewEvent}
        onDeleteSuccess={handleEventDeleted}
        onUpdateSuccess={handleEventUpdated}
      />
      {selectedDate && (
        <AddEventModal
          open={modalOpen}
          onClose={closeAddModal}
          selectedDate={selectedDate}
          onSubmit={handleAddEvent}
        />
      )}
    </>
  );
}
