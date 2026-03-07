"use client";

import { LoadingSpinner } from "@/components/ui/LoadingSpinner/LoadingSpinner";
import type { SelectableItem } from "@/types";

type SelectableItemRowSingleProps = {
  item: SelectableItem;
  onSelect: (id: string) => void;
  isLoading: boolean;
  isDisabled: boolean;
};

export function SelectableItemRowSingle({
  item,
  onSelect,
  isLoading,
  isDisabled,
}: SelectableItemRowSingleProps) {
  return (
    <li>
      <button
        type="button"
        onClick={() => onSelect(item.id)}
        disabled={isDisabled}
        className="flex w-full items-center gap-3 rounded-xl content-px py-3 text-left transition-colors hover:bg-(--bg) focus:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:opacity-60 disabled:pointer-events-none"
      >
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-(--border) bg-(--bg) font-display text-sm font-bold uppercase text-accent">
          {isLoading ? <LoadingSpinner size={20} aria-label="Chargement…" /> : item.initial}
        </span>
        <span className="min-w-0 truncate font-display text-sm font-bold uppercase tracking-wider text-(--text)">
          {item.label}
        </span>
        {isLoading ? (
          <span className="ml-auto shrink-0 text-xs text-(--text-muted)">Création…</span>
        ) : null}
      </button>
    </li>
  );
}
