"use client";

import {
  dropdownItemClass,
  dropdownItemDangerClass,
  dropdownPanelClass,
} from "@/components/ui/DropdownMenu/dropdownMenuStyles";
import { Pencil, Trash2 } from "lucide-react";

type MessageBubbleMenuListProps = {
  onEdit: () => void;
  onDeleteClick: () => void;
};

export function MessageBubbleMenuList({ onEdit, onDeleteClick }: MessageBubbleMenuListProps) {
  return (
    <div className={dropdownPanelClass}>
      <button type="button" onClick={onEdit} className={dropdownItemClass}>
        <Pencil className="h-3.5 w-3.5" /> Modifier
      </button>
      <button type="button" onClick={onDeleteClick} className={dropdownItemDangerClass}>
        <Trash2 className="h-3.5 w-3.5" /> Supprimer
      </button>
    </div>
  );
}
