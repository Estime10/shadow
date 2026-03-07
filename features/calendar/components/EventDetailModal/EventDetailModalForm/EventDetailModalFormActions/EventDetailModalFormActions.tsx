"use client";

type EventDetailModalFormActionsProps = {
  onCancel: () => void;
};

export function EventDetailModalFormActions({ onCancel }: EventDetailModalFormActionsProps) {
  const btnBase =
    "flex-1 rounded-lg py-2.5 font-display text-sm font-bold uppercase tracking-wider transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent";
  return (
    <div className="flex gap-2 pt-2">
      <button
        type="button"
        onClick={onCancel}
        className={`${btnBase} border-2 border-(--border) text-(--text) hover:bg-(--surface-hover)`}
      >
        Annuler
      </button>
      <button type="submit" className={`${btnBase} bg-accent text-(--bg) hover:opacity-90`}>
        Enregistrer
      </button>
    </div>
  );
}
