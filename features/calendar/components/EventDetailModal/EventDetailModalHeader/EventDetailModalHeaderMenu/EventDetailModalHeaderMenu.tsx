"use client";

import {
  dropdownItemClass,
  dropdownItemDangerClass,
  dropdownPanelClass,
} from "@/components/ui/DropdownMenu/dropdownMenuStyles";
import { IconButton } from "@/components/ui/IconButton/IconButton";
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
      <IconButton
        aria-label="Options"
        aria-expanded={menuOpen}
        onClick={() => setMenuOpen((o) => !o)}
      >
        <MoreHorizontal className="h-5 w-5" aria-hidden />
      </IconButton>
      {menuOpen && (
        <div className={dropdownPanelClass}>
          <button type="button" onClick={onEditClick} className={dropdownItemClass}>
            <Pencil className="h-3.5 w-3.5" /> Modifier
          </button>
          <button type="button" onClick={onDeleteClick} className={dropdownItemDangerClass}>
            <Trash2 className="h-3.5 w-3.5" /> Supprimer
          </button>
        </div>
      )}
    </div>
  );
}
