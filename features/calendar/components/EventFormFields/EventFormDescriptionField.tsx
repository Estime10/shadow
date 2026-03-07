"use client";

import { eventFormFieldLabelClass, eventFormFieldTextareaClass } from "./eventFormFieldStyles";

type EventFormDescriptionFieldProps = {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  optionalLabel?: boolean;
  error?: string;
};

export function EventFormDescriptionField({
  id = "event-description",
  value,
  onChange,
  placeholder = "Détails…",
  optionalLabel = true,
  error,
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
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`${eventFormFieldTextareaClass} ${error ? "border-(--error) ring-2 ring-(--error)/30" : ""}`}
      />
      {error ? (
        <p id={`${id}-error`} className="text-sm text-(--error)" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
