"use client";

import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormGlobalError } from "@/components/ui/FormGlobalError/FormGlobalError";
import {
  EventFormDescriptionField,
  EventFormTimeField,
  EventFormTitleField,
} from "@/features/calendar/components/EventFormFields";
import {
  eventFormSchema,
  type EventFormValues,
} from "@/features/calendar/schemas/eventFormSchema/eventFormSchema";
import type { CalendarEvent } from "@/features/calendar/types";
import {
  formatDateLabel,
  formatEventTime,
  buildEventDateFromTime,
} from "@/features/calendar/utils";
import { updateEventAction } from "@/features/calendar/actions";
import { useToast } from "@/lib/contexts/ToastContext/ToastContext";
import { EventDetailModalFormActions } from "./EventDetailModalFormActions/EventDetailModalFormActions";

type EventDetailModalFormProps = {
  event: CalendarEvent;
  onSaveSuccess: () => void;
  onCancel: () => void;
};

export function EventDetailModalForm({
  event,
  onSaveSuccess,
  onCancel,
}: EventDetailModalFormProps) {
  const { addToast } = useToast();
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<EventFormValues>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      title: event.title,
      description: event.description ?? "",
      time: formatEventTime(event.eventDate),
    },
  });

  useEffect(() => {
    reset({
      title: event.title,
      description: event.description ?? "",
      time: formatEventTime(event.eventDate),
    });
  }, [event, reset]);

  async function onValid(data: EventFormValues) {
    const { error } = await updateEventAction(event.id, {
      title: data.title,
      description: data.description?.trim() || null,
      eventDate: buildEventDateFromTime(event.eventDate, data.time),
    });
    if (error) {
      setError("root", { message: error });
      return;
    }
    addToast("success", "Événement enregistré");
    onSaveSuccess();
  }

  return (
    <form onSubmit={handleSubmit(onValid)} className="flex flex-col gap-4">
      <p className="font-display text-sm text-(--text-muted)">
        {formatDateLabel(new Date(event.eventDate))}
      </p>
      <Controller
        name="title"
        control={control}
        render={({ field }) => (
          <EventFormTitleField
            id="edit-event-title"
            value={field.value}
            onChange={field.onChange}
            error={errors.title?.message}
          />
        )}
      />
      <Controller
        name="time"
        control={control}
        render={({ field }) => (
          <EventFormTimeField
            id="edit-event-time"
            value={field.value}
            onChange={field.onChange}
            error={errors.time?.message}
          />
        )}
      />
      <Controller
        name="description"
        control={control}
        render={({ field }) => (
          <EventFormDescriptionField
            id="edit-event-description"
            value={field.value}
            onChange={field.onChange}
            error={errors.description?.message}
          />
        )}
      />
      {errors.root?.message ? <FormGlobalError message={errors.root.message} /> : null}
      <EventDetailModalFormActions onCancel={onCancel} disabled={isSubmitting} />
    </form>
  );
}
