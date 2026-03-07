"use client";

import { IconButton } from "@/components/ui/IconButton/IconButton";
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
      <IconButton size="md" hoverVariant="surface" aria-label="Mois précédent" onClick={onPrev}>
        <ChevronLeft className="h-5 w-5" aria-hidden />
      </IconButton>
      <span className="font-display text-lg font-bold uppercase tracking-wider text-(--text)">
        {label}
      </span>
      <IconButton size="md" hoverVariant="surface" aria-label="Mois suivant" onClick={onNext}>
        <ChevronRight className="h-5 w-5" aria-hidden />
      </IconButton>
    </nav>
  );
}
