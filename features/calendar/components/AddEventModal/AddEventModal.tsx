"use client";

import { Modal } from "@/components/ui/Modal/Modal";
import type { CalendarEvent } from "@/features/calendar/types";
import { formatDateLabel } from "@/features/calendar/utils";
import { useAddEventForm } from "@/lib/hooks/calendar";
import { AddEventForm } from "./AddEventForm/AddEventForm";

export type AddEventModalProps = {
  open: boolean;
  onClose: () => void;
  selectedDate: Date;
  onSubmit: (event: CalendarEvent) => void;
};

export function AddEventModal({ open, onClose, selectedDate, onSubmit }: AddEventModalProps) {
  const form = useAddEventForm({ selectedDate, onSubmit, onClose });

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Nouvel événement"
      titleId="add-event-modal-title"
      subtitle={formatDateLabel(selectedDate)}
    >
      <AddEventForm
        title={form.title}
        setTitle={form.setTitle}
        description={form.description}
        setDescription={form.setDescription}
        time={form.time}
        setTime={form.setTime}
        onSubmit={form.handleSubmit}
        onCancel={form.onCancel}
      />
    </Modal>
  );
}
