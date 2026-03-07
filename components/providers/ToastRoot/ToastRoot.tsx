"use client";

import { type ReactNode } from "react";
import { ToastProvider } from "@/lib/contexts/ToastContext/ToastContext";
import { ToastContainer } from "@/components/ui/Toast/ToastContainer";

type ToastRootProps = {
  children: ReactNode;
};

export function ToastRoot({ children }: ToastRootProps) {
  return (
    <ToastProvider>
      {children}
      <ToastContainer />
    </ToastProvider>
  );
}
