"use client";

import { IconButton } from "@/components/ui/IconButton/IconButton";
import { X } from "lucide-react";
import { EventDetailModalHeaderMenu } from "./EventDetailModalHeaderMenu/EventDetailModalHeaderMenu";

type EventDetailModalHeaderProps = {
  title: string;
  isCreator: boolean;
  editing: boolean;
  menuOpen: boolean;
  setMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
  menuRef: React.RefObject<HTMLDivElement | null>;
  onEditClick: () => void;
  onDeleteClick: () => void;
  onClose: () => void;
};

export function EventDetailModalHeader({
  title,
  isCreator,
  editing,
  menuOpen,
  setMenuOpen,
  menuRef,
  onEditClick,
  onDeleteClick,
  onClose,
}: EventDetailModalHeaderProps) {
  return (
    <div className="shrink-0 flex items-center justify-between border-b-2 border-(--border) content-px py-3">
      <h2
        id="event-detail-modal-title"
        className="min-w-0 truncate pr-2 font-display text-lg font-bold uppercase tracking-wider text-(--text)"
      >
        {title}
      </h2>
      <div className="flex items-center gap-1">
        {isCreator && !editing && (
          <EventDetailModalHeaderMenu
            menuOpen={menuOpen}
            setMenuOpen={setMenuOpen}
            menuRef={menuRef}
            onEditClick={onEditClick}
            onDeleteClick={onDeleteClick}
          />
        )}
        <IconButton aria-label="Fermer" onClick={onClose}>
          <X className="h-5 w-5" aria-hidden />
        </IconButton>
      </div>
    </div>
  );
}
