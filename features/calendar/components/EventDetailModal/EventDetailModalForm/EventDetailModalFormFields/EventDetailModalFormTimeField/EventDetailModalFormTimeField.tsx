"use client";

import { TimeInput } from "@/components/ui/TimeInput/TimeInput";

const labelClass =
  "block font-display text-xs font-bold uppercase tracking-wider text-(--text-muted) mb-1";

type EventDetailModalFormTimeFieldProps = {
  value: string;
  onChange: (value: string) => void;
};

export function EventDetailModalFormTimeField({
  value,
  onChange,
}: EventDetailModalFormTimeFieldProps) {
  return (
    <div>
      <label htmlFor="edit-event-time" className={labelClass}>
        Heure
      </label>
      <TimeInput id="edit-event-time" value={value} onChange={onChange} stepMinutes={15} />
    </div>
  );
}
