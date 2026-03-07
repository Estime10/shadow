"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button/Button";

type ConfirmModalPanelProps = {
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel: string;
  onClose: () => void;
  onConfirm: () => void;
  duration: number;
  easing: readonly [number, number, number, number];
};

export function ConfirmModalPanel({
  title,
  message,
  confirmLabel,
  cancelLabel,
  onClose,
  onConfirm,
  duration,
  easing,
}: ConfirmModalPanelProps) {
  return (
    <motion.div
      className="relative z-10 w-full max-w-sm rounded-xl border-2 border-(--border) bg-surface p-6 shadow-xl"
      onClick={(e) => e.stopPropagation()}
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration, ease: easing }}
    >
      <h2
        id="confirm-modal-title"
        className="font-display text-lg font-bold uppercase tracking-wider text-(--text)"
      >
        {title}
      </h2>
      <p id="confirm-modal-desc" className="mt-2 text-sm text-(--text-muted)">
        {message}
      </p>
      <div className="mt-6 flex gap-3">
        <Button type="button" variant="secondary" onClick={onClose} className="flex-1">
          {cancelLabel}
        </Button>
        <Button type="button" variant="primary" onClick={onConfirm} className="flex-1">
          {confirmLabel}
        </Button>
      </div>
    </motion.div>
  );
}
