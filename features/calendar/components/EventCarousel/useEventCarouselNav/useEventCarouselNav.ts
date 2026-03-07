"use client";

import { useRef, useState, useCallback } from "react";

export type UseEventCarouselNavParams = {
  eventsLength: number;
};

export type UseEventCarouselNavReturn = {
  cardRefs: React.MutableRefObject<(HTMLDivElement | null)[]>;
  clampedIndex: number;
  goPrev: () => void;
  goNext: () => void;
  goTo: (index: number) => void;
};

export function useEventCarouselNav({
  eventsLength,
}: UseEventCarouselNavParams): UseEventCarouselNavReturn {
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const clampedIndex = eventsLength > 0 ? Math.min(currentIndex, eventsLength - 1) : 0;

  const goTo = useCallback(
    (index: number) => {
      const i = Math.max(0, Math.min(index, eventsLength - 1));
      setCurrentIndex(i);
      const el = cardRefs.current[i];
      if (el) {
        el.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "center",
        });
      }
    },
    [eventsLength]
  );

  const goPrev = useCallback(() => goTo(clampedIndex - 1), [clampedIndex, goTo]);
  const goNext = useCallback(() => goTo(clampedIndex + 1), [clampedIndex, goTo]);

  return { cardRefs, clampedIndex, goPrev, goNext, goTo };
}
