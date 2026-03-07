"use client";

import type { CalendarEvent } from "@/features/calendar/types";
import { AddEventModal } from "../../AddEventModal/AddEventModal";
import { EventDetailModal } from "../../EventDetailModal/EventDetailModal";

type CalendarViewModalsProps = {
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
