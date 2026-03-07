"use client";

import { useToast } from "@/lib/contexts/ToastContext/ToastContext";
import { Toast } from "./Toast";

export function ToastContainer() {
  const { toasts, removeToast } = useToast();
  if (toasts.length === 0) return null;

  return (
    <div
      className="fixed bottom-24 left-0 right-0 z-50 content-px safe-area-bottom pointer-events-none"
      aria-label="Notifications"
    >
      <div className="content-max-w flex flex-col gap-2 pointer-events-auto">
        {toasts.map((toast) => (
          <Toast key={toast.id} toast={toast} onDismiss={removeToast} />
        ))}
      </div>
    </div>
  );
}
