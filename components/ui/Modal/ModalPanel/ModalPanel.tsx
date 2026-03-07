"use client";

import { type ReactNode } from "react";
import { motion } from "framer-motion";
import { ModalPanelHeader } from "./ModalPanelHeader/ModalPanelHeader";

type ModalPanelProps = {
  title?: string;
  titleId: string;
  subtitle?: ReactNode;
  onClose: () => void;
  contentClassName: string;
  children: ReactNode;
  duration: number;
  easing: readonly [number, number, number, number];
};

export function ModalPanel({
  title,
  titleId,
  subtitle,
  onClose,
  contentClassName,
  children,
  duration,
  easing,
}: ModalPanelProps) {
  return (
    <motion.div
      className={`relative z-10 w-full max-w-md flex flex-col rounded-xl border-2 border-(--border) bg-(--surface) shadow-xl ${contentClassName}`.trim()}
      onClick={(e) => e.stopPropagation()}
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration, ease: easing }}
    >
      <ModalPanelHeader title={title} titleId={titleId} subtitle={subtitle} onClose={onClose} />
      <div className="flex flex-1 flex-col min-h-0">{children}</div>
    </motion.div>
  );
}
