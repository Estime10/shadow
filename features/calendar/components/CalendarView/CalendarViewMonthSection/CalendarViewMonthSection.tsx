"use client";

import { MonthNav } from "../../MonthNav/MonthNav";
import { MonthGrid } from "../../MonthGrid/MonthGrid";

type CalendarViewMonthSectionProps = {
  year: number;
  month: number;
  today: Date;
  eventsByDay: Map<string, number>;
  onPrev: () => void;
  onNext: () => void;
  onDayClick: (date: Date) => void;
};

export function CalendarViewMonthSection({
  year,
  month,
  today,
  eventsByDay,
  onPrev,
  onNext,
  onDayClick,
}: CalendarViewMonthSectionProps) {
  return (
    <section className="shrink-0 max-h-[50vh] lg:max-h-none flex flex-col min-h-0">
      <MonthNav year={year} month={month} onPrev={onPrev} onNext={onNext} />
      <MonthGrid
        year={year}
        month={month}
        today={today}
        eventsByDay={eventsByDay}
        onDayClick={onDayClick}
      />
    </section>
  );
}
