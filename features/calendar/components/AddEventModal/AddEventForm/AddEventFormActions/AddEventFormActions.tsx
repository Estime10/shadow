"use client";

type AddEventFormActionsProps = {
  onCancel: () => void;
};

export function AddEventFormActions({ onCancel }: AddEventFormActionsProps) {
  return (
    <div className="flex gap-2 pt-2">
      <button
        type="button"
        onClick={onCancel}
        className="flex-1 rounded-lg border-2 border-(--border) py-2.5 font-display text-sm font-bold uppercase tracking-wider text-(--text) transition-colors hover:bg-(--surface-hover)"
      >
        Annuler
      </button>
      <button
        type="submit"
        className="flex-1 rounded-lg bg-accent py-2.5 font-display text-sm font-bold uppercase tracking-wider text-(--bg) transition-colors hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
      >
        Ajouter
      </button>
    </div>
  );
}
