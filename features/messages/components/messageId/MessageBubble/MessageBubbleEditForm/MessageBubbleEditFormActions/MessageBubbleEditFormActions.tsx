"use client";

type MessageBubbleEditFormActionsProps = {
  onCancel: () => void;
};

export function MessageBubbleEditFormActions({ onCancel }: MessageBubbleEditFormActionsProps) {
  return (
    <div className="flex justify-end gap-2">
      <button
        type="button"
        onClick={onCancel}
        className="md:cursor-pointer rounded px-2 py-1 text-xs font-medium text-(--text-muted)"
      >
        Annuler
      </button>
      <button
        type="submit"
        className="md:cursor-pointer rounded bg-accent px-2 py-1 font-display text-xs font-bold uppercase text-(--bg)"
      >
        Enregistrer
      </button>
    </div>
  );
}
