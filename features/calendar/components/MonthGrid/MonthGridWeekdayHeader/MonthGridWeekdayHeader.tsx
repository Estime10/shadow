"use client";

import { WEEKDAY_LABELS } from "@/features/calendar/constants";

export function MonthGridWeekdayHeader() {
  return (
    <>
      {WEEKDAY_LABELS.map((label) => (
        <div
          key={label}
          className="bg-(--surface) py-2 text-center font-display text-xs font-bold uppercase tracking-wider text-(--text-muted)"
        >
          {label}
        </div>
      ))}
    </>
  );
}
