"use client";

import { Button } from "@/components/ui/Button/Button";

type AddEventFormActionsProps = {
  onCancel: () => void;
};

export function AddEventFormActions({ onCancel }: AddEventFormActionsProps) {
  return (
    <div className="flex gap-2 pt-2">
      <Button variant="outline" fullWidth onClick={onCancel}>
        Annuler
      </Button>
      <Button type="submit" fullWidth>
        Ajouter
      </Button>
    </div>
  );
}
