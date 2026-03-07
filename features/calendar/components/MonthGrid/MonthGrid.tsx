"use client";

import { getMonthGridDays, isSameDay, isCurrentMonth } from "@/features/calendar/utils";
import { MonthGridWeekdayHeader } from "./MonthGridWeekdayHeader/MonthGridWeekdayHeader";
import { MonthGridDayCell } from "./MonthGridDayCell/MonthGridDayCell";

export type MonthGridProps = {
  year: number;
  month: number;
  today?: Date;
  eventsByDay?: Map<string, number>;
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
        <MonthGridWeekdayHeader />
        {days.map((date) => {
          const isInMonth = isCurrentMonth(date, year, month);
          const isToday = isSameDay(date, today);
          const dateKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
          const count = eventsByDay?.get(dateKey) ?? 0;
          return (
            <MonthGridDayCell
              key={date.toISOString()}
              date={date}
              isInMonth={isInMonth}
              isToday={isToday}
              count={count}
              onDayClick={onDayClick}
            />
          );
        })}
      </div>
    </div>
  );
}
