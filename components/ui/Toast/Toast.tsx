"use client";

import { CheckCircle, XCircle } from "lucide-react";
import type { ToastItem } from "@/lib/contexts/ToastContext/ToastContext";

type ToastProps = {
  toast: ToastItem;
  onDismiss: (id: string) => void;
};

export function Toast({ toast, onDismiss }: ToastProps) {
  const isSuccess = toast.type === "success";
  return (
    <div
      role="status"
      aria-live="polite"
      className={`flex items-center gap-3 rounded-xl border-2 border-(--surface) bg-(--surface) px-4 py-3 shadow-lg ${
        isSuccess ? "border-accent" : "border-(--error)"
      }`}
    >
      {isSuccess ? (
        <CheckCircle className="h-5 w-5 shrink-0 text-accent" aria-hidden />
      ) : (
        <XCircle className="h-5 w-5 shrink-0 text-(--error)" aria-hidden />
      )}
      <p
        className={`flex-1 font-display text-sm font-medium ${
          isSuccess ? "text-(--text)" : "text-(--error)"
        }`}
      >
        {toast.message}
      </p>
      <button
        type="button"
        onClick={() => onDismiss(toast.id)}
        className="shrink-0 rounded p-1 text-(--text-muted) transition-colors hover:text-(--text) focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        aria-label="Fermer"
      >
        <span className="sr-only">Fermer</span>
        <span aria-hidden>×</span>
      </button>
    </div>
  );
}
