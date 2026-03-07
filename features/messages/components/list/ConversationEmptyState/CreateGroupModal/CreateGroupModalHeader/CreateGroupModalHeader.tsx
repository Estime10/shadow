"use client";

import { IconButton } from "@/components/ui/IconButton/IconButton";
import { X } from "lucide-react";

type CreateGroupModalHeaderProps = {
  onClose: () => void;
};

export function CreateGroupModalHeader({ onClose }: CreateGroupModalHeaderProps) {
  return (
    <div className="shrink-0 border-b-2 border-(--border) p-4">
      <div className="flex items-center justify-between gap-2">
        <h2
          id="create-group-modal-title"
          className="font-display text-lg font-bold uppercase tracking-wider text-(--text)"
        >
          Créer un groupe
        </h2>
        <IconButton aria-label="Fermer" onClick={onClose}>
          <X className="h-5 w-5" aria-hidden />
        </IconButton>
      </div>
    </div>
  );
}
