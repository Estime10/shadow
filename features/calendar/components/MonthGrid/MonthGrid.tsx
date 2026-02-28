"use client";

import { WEEKDAY_LABELS } from "@/features/calendar/constants";
import { getMonthGridDays, isSameDay, isCurrentMonth } from "@/features/calendar/utils";

export type MonthGridProps = {
  year: number;
  month: number;
  today?: Date;
  eventsByDay?: Map<string, number>; // date key (YYYY-MM-DD) -> count
  onDayClick?: (date: Date) => void;
};

export function MonthGrid({
  year,
  month,
  today = new Date(),
  eventsByDay,
  onDayClick,
}: MonthGridProps) {
  const days = getMonthGridDays(year, month);
  return (
    <div className="content-px">
      <div className="grid grid-cols-7 gap-px rounded-xl border-2 border-(--border) bg-(--border) overflow-hidden">
        {WEEKDAY_LABELS.map((label) => (
          <div
            key={label}
            className="bg-(--surface) py-2 text-center font-display text-xs font-bold uppercase tracking-wider text-(--text-muted)"
          >
            {label}
          </div>
        ))}
        {days.map((date) => {
          const isInMonth = isCurrentMonth(date, year, month);
          const isToday = isSameDay(date, today);
          const dateKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
          const count = eventsByDay?.get(dateKey) ?? 0;
          const content = (
            <>
              <span className="font-display text-sm font-medium">{date.getDate()}</span>
              {count > 0 && (
                <span
                  className="mt-0.5 h-1.5 w-1.5 rounded-full bg-accent"
                  aria-label={`${count} événement${count > 1 ? "s" : ""}`}
                />
              )}
            </>
          );
          const className = `min-h-12 bg-(--surface) p-1 flex flex-col items-center justify-center ${
            !isInMonth ? "text-(--text-muted) opacity-60" : "text-(--text)"
          } ${isToday ? "ring-2 ring-inset ring-accent" : ""} ${
            onDayClick ? "cursor-pointer transition-colors hover:bg-(--surface-hover)" : ""
          }`;
          return onDayClick ? (
            <button
              key={date.toISOString()}
              type="button"
              onClick={() => onDayClick(date)}
              className={className}
              aria-label={`Ajouter un événement le ${date.getDate()} ${date.getMonth() + 1}`}
            >
              {content}
            </button>
          ) : (
            <div key={date.toISOString()} className={className}>
              {content}
            </div>
          );
        })}
      </div>
    </div>
  );
}
