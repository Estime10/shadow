"use client";

import {
  EventFormDescriptionField,
  EventFormTimeField,
  EventFormTitleField,
} from "@/features/calendar/components/EventFormFields";

type AddEventFormFieldsProps = {
  title: string;
  setTitle: (value: string) => void;
  description: string;
  setDescription: (value: string) => void;
  time: string;
  setTime: (value: string) => void;
};

export function AddEventFormFields({
  title,
  setTitle,
  description,
  setDescription,
  time,
  setTime,
}: AddEventFormFieldsProps) {
  return (
    <>
      <EventFormTitleField id="add-event-title" value={title} onChange={setTitle} autoFocus />
      <EventFormTimeField id="add-event-time" value={time} onChange={setTime} />
      <EventFormDescriptionField
        id="add-event-description"
        value={description}
        onChange={setDescription}
      />
    </>
  );
}
