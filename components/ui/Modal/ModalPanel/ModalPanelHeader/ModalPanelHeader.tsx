"use client";

import { type ReactNode } from "react";
import { X } from "lucide-react";

type ModalPanelHeaderProps = {
  title?: string;
  titleId: string;
  subtitle?: ReactNode;
  onClose: () => void;
};

export function ModalPanelHeader({ title, titleId, subtitle, onClose }: ModalPanelHeaderProps) {
  if (!title && !subtitle) return null;

  return (
    <div className="shrink-0 flex flex-col border-b-2 border-(--border) content-px py-3">
      <div className="flex items-center justify-between">
        {title ? (
          <h2
            id={titleId}
            className="font-display text-lg font-bold uppercase tracking-wider text-(--text)"
          >
            {title}
          </h2>
        ) : null}
        <button
          type="button"
          onClick={onClose}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-(--text-muted) transition-colors hover:bg-(--bg) hover:text-(--text) focus:outline-none focus-visible:ring-2 focus-visible:ring-accent ml-auto"
          aria-label="Fermer"
        >
          <X className="h-5 w-5" aria-hidden />
        </button>
      </div>
      {subtitle ? (
        <p className="font-display text-sm text-(--text-muted) mt-1">{subtitle}</p>
      ) : null}
    </div>
  );
}
