"use client";

import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";

type EventDetailModalHeaderMenuProps = {
  menuOpen: boolean;
  setMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
  menuRef: React.RefObject<HTMLDivElement | null>;
  onEditClick: () => void;
  onDeleteClick: () => void;
};

export function EventDetailModalHeaderMenu({
  menuOpen,
  setMenuOpen,
  menuRef,
  onEditClick,
  onDeleteClick,
}: EventDetailModalHeaderMenuProps) {
  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setMenuOpen((o) => !o)}
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-(--text-muted) transition-colors hover:bg-(--bg) hover:text-(--text) focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        aria-label="Options"
        aria-expanded={menuOpen}
      >
        <MoreHorizontal className="h-5 w-5" aria-hidden />
      </button>
      {menuOpen && (
        <div className="absolute right-0 top-full z-10 mt-1 min-w-40 rounded-lg border-2 border-(--border) bg-(--surface) py-1 shadow-lg">
          <button
            type="button"
            onClick={onEditClick}
            className="flex w-full items-center gap-2 content-px py-2 text-left font-display text-sm text-(--text) hover:bg-(--bg)"
          >
            <Pencil className="h-3.5 w-3.5" /> Modifier
          </button>
          <button
            type="button"
            onClick={onDeleteClick}
            className="flex w-full items-center gap-2 content-px py-2 text-left font-display text-sm text-(--error) hover:bg-(--bg)"
          >
            <Trash2 className="h-3.5 w-3.5" /> Supprimer
          </button>
        </div>
      )}
    </div>
  );
}
