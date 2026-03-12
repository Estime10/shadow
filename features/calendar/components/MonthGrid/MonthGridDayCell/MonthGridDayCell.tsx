"use client";

type MonthGridDayCellProps = {
  date: Date;
  isInMonth: boolean;
  isToday: boolean;
  count: number;
  onDayClick?: (date: Date) => void;
};

export function MonthGridDayCell({
  date,
  isInMonth,
  isToday,
  count,
  onDayClick,
}: MonthGridDayCellProps) {
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
    onDayClick ? "md:cursor-pointer transition-colors md:hover:bg-(--surface-hover)" : ""
  }`;

  if (onDayClick) {
    return (
      <button
        type="button"
        onClick={() => onDayClick(date)}
        className={className}
        aria-label={`Voir les événements du ${date.getDate()}`}
      >
        {content}
      </button>
    );
  }

  return <div className={className}>{content}</div>;
}
