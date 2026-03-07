"use client";

import { TimeInput } from "@/components/ui/TimeInput/TimeInput";

type AddEventFormTimeFieldProps = {
  value: string;
  onChange: (value: string) => void;
};

const labelClass =
  "block font-display text-xs font-bold uppercase tracking-wider text-(--text-muted) mb-1";

export function AddEventFormTimeField({ value, onChange }: AddEventFormTimeFieldProps) {
  return (
    <div>
      <label htmlFor="add-event-time" className={labelClass}>
        Heure
      </label>
      <TimeInput id="add-event-time" value={value} onChange={onChange} stepMinutes={15} />
    </div>
  );
}
