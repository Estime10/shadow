"use client";

import { AddEventFormTitleField } from "./AddEventFormTitleField/AddEventFormTitleField";
import { AddEventFormTimeField } from "./AddEventFormTimeField/AddEventFormTimeField";
import { AddEventFormDescriptionField } from "./AddEventFormDescriptionField/AddEventFormDescriptionField";

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
      <AddEventFormTitleField value={title} onChange={setTitle} />
      <AddEventFormTimeField value={time} onChange={setTime} />
      <AddEventFormDescriptionField value={description} onChange={setDescription} />
    </>
  );
}
