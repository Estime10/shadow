"use client";

import { IconButton } from "@/components/ui/IconButton/IconButton";
import { X, Plus } from "lucide-react";

type DayEventsModalHeaderProps = {
  title: string;
  onAddEvent: () => void;
  onClose: () => void;
};

export function DayEventsModalHeader({ title, onAddEvent, onClose }: DayEventsModalHeaderProps) {
  return (
    <div className="shrink-0 flex flex-col border-b-2 border-(--border) content-px py-3">
      <div className="flex items-center justify-between gap-2">
        <h2
          id="day-events-modal-title"
          className="font-display text-lg font-bold uppercase tracking-wider text-(--text) truncate min-w-0"
        >
          {title}
        </h2>
        <div className="flex shrink-0 items-center gap-1">
          <button
            type="button"
            onClick={onAddEvent}
            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 font-display text-xs font-bold uppercase tracking-wider text-(--text) transition-colors md:hover:bg-(--surface-hover) focus-visible:outline focus-visible:ring-2 focus-visible:ring-accent"
            aria-label="Ajouter un événement"
          >
            <Plus className="h-4 w-4" aria-hidden />
            <span className="hidden sm:inline">Ajouter</span>
          </button>
          <IconButton className="shrink-0" aria-label="Fermer" onClick={onClose}>
            <X className="h-5 w-5" aria-hidden />
          </IconButton>
        </div>
      </div>
    </div>
  );
}
