"use client";

import { Button } from "@/components/ui/Button/Button";

type AddEventFormActionsProps = {
  onCancel: () => void;
  disabled?: boolean;
};

export function AddEventFormActions({ onCancel, disabled = false }: AddEventFormActionsProps) {
  return (
    <div className="flex gap-2 pt-2">
      <Button variant="outline" fullWidth onClick={onCancel} type="button" disabled={disabled}>
        Annuler
      </Button>
      <Button type="submit" fullWidth disabled={disabled}>
        Ajouter
      </Button>
    </div>
  );
}
