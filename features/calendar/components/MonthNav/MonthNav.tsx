"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { MONTH_LABELS } from "@/features/calendar/constants";

export type MonthNavProps = {
  year: number;
  month: number;
  onPrev: () => void;
  onNext: () => void;
};

export function MonthNav({ year, month, onPrev, onNext }: MonthNavProps) {
  const label = `${MONTH_LABELS[month]} ${year}`;
  return (
    <nav
      className="flex items-center justify-between content-px py-2"
      aria-label="Navigation par mois"
    >
      <button
        type="button"
        onClick={onPrev}
        className="flex h-10 w-10 items-center justify-center rounded-full text-(--text-muted) transition-colors hover:bg-(--surface) hover:text-(--text) focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        aria-label="Mois précédent"
      >
        <ChevronLeft className="h-5 w-5" aria-hidden />
      </button>
      <span className="font-display text-lg font-bold uppercase tracking-wider text-(--text)">
        {label}
      </span>
      <button
        type="button"
        onClick={onNext}
        className="flex h-10 w-10 items-center justify-center rounded-full text-(--text-muted) transition-colors hover:bg-(--surface) hover:text-(--text) focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        aria-label="Mois suivant"
      >
        <ChevronRight className="h-5 w-5" aria-hidden />
      </button>
    </nav>
  );
}
