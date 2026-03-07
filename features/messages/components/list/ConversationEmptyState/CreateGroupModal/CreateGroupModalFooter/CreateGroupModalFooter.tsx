"use client";

type CreateGroupModalFooterProps = {
  canSubmit: boolean;
  creating?: boolean;
  onSubmit: () => void;
};

export function CreateGroupModalFooter({
  canSubmit,
  creating = false,
  onSubmit,
}: CreateGroupModalFooterProps) {
  return (
    <div className="shrink-0 border-t-2 border-(--border) p-4">
      <button
        type="button"
        onClick={onSubmit}
        disabled={!canSubmit || creating}
        title={!canSubmit ? "Sélectionnez au moins 2 participants" : undefined}
        className="w-full md:cursor-pointer rounded-xl border-2 border-accent bg-(--accent)/15 py-3 font-display text-sm font-bold uppercase tracking-wider text-accent transition-colors md:hover:bg-(--accent)/25 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:border-(--border) disabled:bg-(--bg) disabled:text-(--text-muted) disabled:opacity-60"
      >
        {creating ? "Création…" : "Créer le groupe"}
      </button>
    </div>
  );
}
