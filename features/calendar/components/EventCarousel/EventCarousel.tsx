"use client";

import { useRef, useCallback, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { CalendarEvent } from "@/features/calendar/types";
import { EventCard } from "../EventCard/EventCard";

export type EventCarouselProps = {
  events: CalendarEvent[];
  emptyMessage?: string;
  onEventClick?: (event: CalendarEvent) => void;
};

export function EventCarousel({
  events,
  emptyMessage = "Aucun événement ce mois-ci.",
  onEventClick,
}: EventCarouselProps) {
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const clampedIndex = events.length > 0 ? Math.min(currentIndex, events.length - 1) : 0;

  const goTo = useCallback(
    (index: number) => {
      const i = Math.max(0, Math.min(index, events.length - 1));
      setCurrentIndex(i);
      const el = cardRefs.current[i];
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
      }
    },
    [events.length]
  );

  const goPrev = useCallback(() => goTo(clampedIndex - 1), [clampedIndex, goTo]);
  const goNext = useCallback(() => goTo(clampedIndex + 1), [clampedIndex, goTo]);

  const canGoPrev = clampedIndex > 0;
  const canGoNext = clampedIndex < events.length - 1;

  if (events.length === 0) {
    return (
      <p className="content-px py-6 font-display text-sm text-(--text-muted)">{emptyMessage}</p>
    );
  }

  return (
    <div className="relative content-px py-4">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={goPrev}
          disabled={!canGoPrev}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-(--border) bg-(--surface) text-(--text-muted) transition-colors hover:border-(--accent-dim) hover:text-(--text) focus:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:opacity-40 disabled:pointer-events-none"
          aria-label="Événement précédent"
        >
          <ChevronLeft className="h-5 w-5" aria-hidden />
        </button>
        <div
          className="flex-1 min-w-0 overflow-x-auto overflow-y-hidden scroll-smooth py-2 -mx-content-px content-px [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          style={{
            scrollSnapType: "x mandatory",
            WebkitOverflowScrolling: "touch",
          }}
        >
          <div className="flex gap-3 justify-center lg:justify-start min-w-min">
            {events.map((event, i) => (
              <div
                key={event.id}
                ref={(el) => {
                  cardRefs.current[i] = el;
                }}
                className="flex-shrink-0 w-[280px] max-w-[85vw] snap-center"
              >
                <EventCard event={event} onClick={onEventClick} />
              </div>
            ))}
          </div>
        </div>
        <button
          type="button"
          onClick={goNext}
          disabled={!canGoNext}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-(--border) bg-(--surface) text-(--text-muted) transition-colors hover:border-(--accent-dim) hover:text-(--text) focus:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:opacity-40 disabled:pointer-events-none"
          aria-label="Événement suivant"
        >
          <ChevronRight className="h-5 w-5" aria-hidden />
        </button>
      </div>
    </div>
  );
}
