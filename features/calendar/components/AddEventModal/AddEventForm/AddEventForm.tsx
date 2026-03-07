"use client";

import { AddEventFormFields } from "./AddEventFormFields/AddEventFormFields";
import { AddEventFormActions } from "./AddEventFormActions/AddEventFormActions";

export type AddEventFormProps = {
  title: string;
  setTitle: (value: string) => void;
  description: string;
  setDescription: (value: string) => void;
  time: string;
  setTime: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
};

export function AddEventForm({
  title,
  setTitle,
  description,
  setDescription,
  time,
  setTime,
  onSubmit,
  onCancel,
}: AddEventFormProps) {
  return (
    <form onSubmit={onSubmit} className="flex flex-1 flex-col gap-4 content-px py-4">
      <AddEventFormFields
        title={title}
        setTitle={setTitle}
        description={description}
        setDescription={setDescription}
        time={time}
        setTime={setTime}
      />
      <AddEventFormActions onCancel={onCancel} />
    </form>
  );
}
