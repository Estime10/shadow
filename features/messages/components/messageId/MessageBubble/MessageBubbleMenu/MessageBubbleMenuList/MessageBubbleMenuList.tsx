"use client";

import { Pencil, Trash2 } from "lucide-react";

type MessageBubbleMenuListProps = {
  onEdit: () => void;
  onDeleteClick: () => void;
};

export function MessageBubbleMenuList({ onEdit, onDeleteClick }: MessageBubbleMenuListProps) {
  return (
    <div className="absolute right-0 top-full z-10 mt-1 min-w-32 rounded-lg border-2 border-(--border) bg-surface py-1 shadow-lg">
      <button
        type="button"
        onClick={onEdit}
        className="flex w-full items-center gap-2 content-px py-2 text-left text-sm hover:bg-(--bg)"
      >
        <Pencil className="h-3.5 w-3.5" /> Modifier
      </button>
      <button
        type="button"
        onClick={onDeleteClick}
        className="flex w-full items-center gap-2 content-px py-2 text-left text-sm text-red-600 hover:bg-(--bg)"
      >
        <Trash2 className="h-3.5 w-3.5" /> Supprimer
      </button>
    </div>
  );
}
