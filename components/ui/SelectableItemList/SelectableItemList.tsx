"use client";

import { LoadingSpinner } from "@/components/ui/LoadingSpinner/LoadingSpinner";
import { Checkbox } from "@/components/ui/Checkbox/Checkbox";

export type SelectableItem = {
  id: string;
  initial: string;
  label: string;
};

type SelectableItemListBase = {
  items: SelectableItem[];
  emptyMessage: string;
};

type SelectableItemListSingle = SelectableItemListBase & {
  variant: "single";
  onSelect: (id: string) => void;
  loadingId?: string | null;
  error?: string | null;
};

type SelectableItemListMulti = SelectableItemListBase & {
  variant: "multi";
  selectedIds: Set<string>;
  onToggle: (id: string) => void;
  selectedCountLabel?: React.ReactNode;
};

export type SelectableItemListProps = SelectableItemListSingle | SelectableItemListMulti;

export function SelectableItemList(props: SelectableItemListProps) {
  const { items, emptyMessage } = props;

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      {props.variant === "multi" && props.selectedCountLabel ? (
        <div className="mb-2 shrink-0 text-xs text-(--text-muted)">{props.selectedCountLabel}</div>
      ) : null}
      <div className="min-h-0 flex-1 overflow-y-auto p-2">
        {props.variant === "single" && props.error ? (
          <p
            className="mb-2 rounded-lg bg-red-500/10 px-3 py-2 text-sm text-(--error)"
            role="alert"
          >
            {props.error}
          </p>
        ) : null}
        {items.length === 0 ? (
          <p className="py-8 text-center font-display text-sm text-(--text-muted)">
            {emptyMessage}
          </p>
        ) : (
          <ul className="space-y-1" role="list">
            {items.map((item) => {
              if (props.variant === "single") {
                const isLoading = props.loadingId === item.id;
                return (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => props.onSelect(item.id)}
                      disabled={props.loadingId !== null && props.loadingId !== undefined}
                      className="flex w-full items-center gap-3 rounded-xl content-px py-3 text-left transition-colors hover:bg-(--bg) focus:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:opacity-60 disabled:pointer-events-none"
                    >
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-(--border) bg-(--bg) font-display text-sm font-bold uppercase text-accent">
                        {isLoading ? (
                          <LoadingSpinner size={20} aria-label="Chargement…" />
                        ) : (
                          item.initial
                        )}
                      </span>
                      <span className="min-w-0 truncate font-display text-sm font-bold uppercase tracking-wider text-(--text)">
                        {item.label}
                      </span>
                      {isLoading ? (
                        <span className="ml-auto shrink-0 text-xs text-(--text-muted)">
                          Création…
                        </span>
                      ) : null}
                    </button>
                  </li>
                );
              }
              const isSelected = props.selectedIds.has(item.id);
              return (
                <li key={item.id}>
                  <label className="flex cursor-pointer items-center gap-3 rounded-xl content-px py-3 transition-colors hover:bg-(--bg) focus-within:ring-2 focus-within:ring-accent">
                    <Checkbox
                      checked={isSelected}
                      onChange={() => props.onToggle(item.id)}
                      aria-label={`Sélectionner ${item.label}`}
                    />
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-(--border) bg-(--bg) font-display text-sm font-bold uppercase text-accent">
                      {item.initial}
                    </span>
                    <span className="min-w-0 truncate font-display text-sm font-bold uppercase tracking-wider text-(--text)">
                      {item.label}
                    </span>
                  </label>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
