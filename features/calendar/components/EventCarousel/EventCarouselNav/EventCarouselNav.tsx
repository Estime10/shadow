"use client";

import { type ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

type EventCarouselNavProps = {
  onPrev: () => void;
  onNext: () => void;
  canGoPrev: boolean;
  canGoNext: boolean;
  children: ReactNode;
};

const navBtnClass =
  "flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-(--border) bg-(--surface) text-(--text-muted) transition-colors hover:border-(--accent-dim) hover:text-(--text) focus:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:opacity-40 disabled:pointer-events-none";

export function EventCarouselNav({
  onPrev,
  onNext,
  canGoPrev,
  canGoNext,
  children,
}: EventCarouselNavProps) {
  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={onPrev}
        disabled={!canGoPrev}
        className={navBtnClass}
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
        {children}
      </div>
      <button
        type="button"
        onClick={onNext}
        disabled={!canGoNext}
        className={navBtnClass}
        aria-label="Événement suivant"
      >
        <ChevronRight className="h-5 w-5" aria-hidden />
      </button>
    </div>
  );
}
