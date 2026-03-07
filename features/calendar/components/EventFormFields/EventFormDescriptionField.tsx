"use client";

import { eventFormFieldLabelClass, eventFormFieldTextareaClass } from "./eventFormFieldStyles";

type EventFormDescriptionFieldProps = {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  optionalLabel?: boolean;
};

export function EventFormDescriptionField({
  id = "event-description",
  value,
  onChange,
  placeholder = "Détails…",
  optionalLabel = true,
}: EventFormDescriptionFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className={eventFormFieldLabelClass}>
        Description {optionalLabel ? <span className="font-normal">(optionnel)</span> : null}
      </label>
      <textarea
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={3}
        className={eventFormFieldTextareaClass}
      />
    </div>
  );
}
