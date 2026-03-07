"use client";

import { IconButton } from "@/components/ui/IconButton/IconButton";
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
        <IconButton className="ml-auto" aria-label="Fermer" onClick={onClose}>
          <X className="h-5 w-5" aria-hidden />
        </IconButton>
      </div>
      {subtitle ? (
        <p className="font-display text-sm text-(--text-muted) mt-1">{subtitle}</p>
      ) : null}
    </div>
  );
}
