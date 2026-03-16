"use client";

import { type ReactNode } from "react";
import { motion } from "framer-motion";
import { ANIMATION_EASING } from "@/lib/config/animations";

type DayEventsModalPanelProps = {
  duration: number;
  children: ReactNode;
};

export function DayEventsModalPanel({ duration, children }: DayEventsModalPanelProps) {
  return (
    <motion.div
      className="relative z-10 w-full max-w-[calc(100vw-2rem)] max-h-[90dvh] md:max-w-md md:max-h-none flex flex-col min-h-0 rounded-xl border-2 border-(--border) bg-surface shadow-xl"
      onClick={(e) => e.stopPropagation()}
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration, ease: ANIMATION_EASING }}
    >
      {children}
    </motion.div>
  );
}
