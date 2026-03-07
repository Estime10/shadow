"use client";

import { TimeInput } from "@/components/ui/TimeInput/TimeInput";
import { eventFormFieldLabelClass } from "./eventFormFieldStyles";

type EventFormTimeFieldProps = {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  stepMinutes?: number;
};

export function EventFormTimeField({
  id = "event-time",
  value,
  onChange,
  stepMinutes = 15,
}: EventFormTimeFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className={eventFormFieldLabelClass}>
        Heure
      </label>
      <TimeInput id={id} value={value} onChange={onChange} stepMinutes={stepMinutes} />
    </div>
  );
}
