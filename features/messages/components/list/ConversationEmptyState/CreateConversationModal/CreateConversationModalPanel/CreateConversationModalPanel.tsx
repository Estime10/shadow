"use client";

import { type ReactNode } from "react";
import { motion } from "framer-motion";
import { ANIMATION_EASING } from "@/lib/config/animations";

type CreateConversationModalPanelProps = {
  duration: number;
  children: ReactNode;
};

export function CreateConversationModalPanel({
  duration,
  children,
}: CreateConversationModalPanelProps) {
  return (
    <motion.div
      className="relative z-10 flex max-h-[85dvh] w-full max-w-md flex-col rounded-xl border-2 border-(--border) bg-surface shadow-xl"
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
