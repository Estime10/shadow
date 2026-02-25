"use client";

import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/Button/Button";

type ConfirmModalProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel?: string;
};

export function ConfirmModal({
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel,
  cancelLabel = "Annuler",
}: ConfirmModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (open) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  function handleOverlayClick(e: React.MouseEvent) {
    if (e.target === overlayRef.current) onClose();
  }

  return (
    <div
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-modal-title"
      aria-describedby="confirm-modal-desc"
      className="fixed inset-0 z-10000 grid min-h-dvh place-items-center p-4"
      onClick={handleOverlayClick}
    >
      <div className="absolute inset-0 bg-black/60" aria-hidden />
      <div
        className="relative z-10 w-full max-w-sm rounded-xl border-2 border-(--border) bg-surface p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
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
      </div>
    </div>
  );
}
