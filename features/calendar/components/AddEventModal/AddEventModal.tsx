"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Modal } from "@/components/ui/Modal/Modal";
import type { CalendarEvent } from "@/features/calendar/types";
import { formatDateLabel } from "@/features/calendar/utils";
import {
  eventFormSchema,
  type EventFormInputValues,
} from "@/features/calendar/schemas/eventFormSchema/eventFormSchema";
import { buildEventFromForm } from "@/features/calendar/utils";
import { AddEventForm } from "./AddEventForm/AddEventForm";

export type AddEventModalProps = {
  open: boolean;
  onClose: () => void;
  selectedDate: Date;
  onSubmit: (event: CalendarEvent) => void;
};

const DEFAULT_TIME = "12:00";

export function AddEventModal({ open, onClose, selectedDate, onSubmit }: AddEventModalProps) {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<EventFormInputValues>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: { title: "", description: "", time: DEFAULT_TIME },
  });

  function onValid(data: EventFormInputValues) {
    const event = buildEventFromForm(selectedDate, {
      title: data.title,
      description: data.description ?? "",
      time: data.time,
    });
    onSubmit(event);
    reset({ title: "", description: "", time: DEFAULT_TIME });
    onClose();
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Nouvel événement"
      titleId="add-event-modal-title"
      subtitle={formatDateLabel(selectedDate)}
    >
      <AddEventForm
        control={control}
        errors={errors}
        isSubmitting={isSubmitting}
        onSubmit={handleSubmit(onValid)}
        onCancel={onClose}
        setError={setError}
      />
    </Modal>
  );
}
