"use client";

type EventDetailModalFormActionsProps = {
  onCancel: () => void;
  disabled?: boolean;
};

export function EventDetailModalFormActions({
  onCancel,
  disabled = false,
}: EventDetailModalFormActionsProps) {
  const btnBase =
    "flex-1 md:cursor-pointer rounded-lg py-2.5 font-display text-sm font-bold uppercase tracking-wider transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:opacity-50";
  return (
    <div className="flex gap-2 pt-2">
      <button
        type="button"
        onClick={onCancel}
        disabled={disabled}
        className={`${btnBase} border-2 border-(--border) text-(--text) md:hover:bg-(--surface-hover)`}
      >
        Annuler
      </button>
      <button
        type="submit"
        disabled={disabled}
        className={`${btnBase} bg-accent text-(--bg) md:hover:opacity-90`}
      >
        Enregistrer
      </button>
    </div>
  );
}
