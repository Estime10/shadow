"use client";

import { Input } from "@/components/ui/Input/Input";

type EventFormTitleFieldProps = {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  autoFocus?: boolean;
  error?: string;
};

export function EventFormTitleField({
  id = "event-title",
  value,
  onChange,
  placeholder = "Ex. Réunion équipe",
  required = true,
  autoFocus = false,
  error,
}: EventFormTitleFieldProps) {
  return (
    <Input
      id={id}
      label="Titre"
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      required={required}
      autoFocus={autoFocus}
      error={error}
    />
  );
}
