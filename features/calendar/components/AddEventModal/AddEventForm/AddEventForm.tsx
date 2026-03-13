"use client";

import { Controller, type Control, type FieldErrors } from "react-hook-form";
import { FormGlobalError } from "@/components/ui/FormGlobalError/FormGlobalError";
import {
  EventFormDescriptionField,
  EventFormTimeField,
  EventFormTitleField,
} from "@/features/calendar/components/EventFormFields";
import type { EventFormInputValues } from "@/features/calendar/schemas/eventFormSchema/eventFormSchema";
import { AddEventFormActions } from "./AddEventFormActions/AddEventFormActions";

type FormErrors = FieldErrors<EventFormInputValues> & { root?: { message?: string } };

export type AddEventFormProps = {
  control: Control<EventFormInputValues>;
  errors: FormErrors;
  isSubmitting: boolean;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onCancel: () => void;
  setError: (name: keyof EventFormInputValues | "root", opts: { message: string }) => void;
};

export function AddEventForm({
  control,
  errors,
  isSubmitting,
  onSubmit,
  onCancel,
}: AddEventFormProps) {
  return (
    <form onSubmit={onSubmit} className="flex flex-1 flex-col gap-4 content-px py-4">
      <Controller
        name="title"
        control={control}
        render={({ field }) => (
          <EventFormTitleField
            id="add-event-title"
            value={field.value}
            onChange={field.onChange}
            autoFocus
            error={errors.title?.message}
          />
        )}
      />
      <Controller
        name="time"
        control={control}
        render={({ field }) => (
          <EventFormTimeField
            id="add-event-time"
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
            id="add-event-description"
            value={field.value ?? ""}
            onChange={field.onChange}
            error={errors.description?.message}
          />
        )}
      />
      {errors.root?.message ? <FormGlobalError message={errors.root.message} /> : null}
      <AddEventFormActions onCancel={onCancel} disabled={isSubmitting} />
    </form>
  );
}
