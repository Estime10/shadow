"use client";

import type { SelectableItem } from "@/types";
import { SelectableItemListRows } from "./SelectableItemListRows/SelectableItemListRows";

type SelectableItemListInnerSingle = {
  variant: "single";
  items: SelectableItem[];
  emptyMessage: string;
  onSelect: (id: string) => void;
  loadingId?: string | null;
  error?: string | null;
};

type SelectableItemListInnerMulti = {
  variant: "multi";
  items: SelectableItem[];
  emptyMessage: string;
  selectedIds: Set<string>;
  onToggle: (id: string) => void;
};

type SelectableItemListInnerProps = SelectableItemListInnerSingle | SelectableItemListInnerMulti;

const emptyPClass = "py-8 text-center font-display text-sm text-(--text-muted)";
const errorPClass = "mb-2 rounded-lg bg-red-500/10 px-3 py-2 text-sm text-(--error)";

export function SelectableItemListInner(props: SelectableItemListInnerProps) {
  const { items, emptyMessage } = props;
  const showError = props.variant === "single" && props.error;
  const showEmpty = items.length === 0;

  const rowsProps =
    props.variant === "single"
      ? { variant: "single" as const, items, onSelect: props.onSelect, loadingId: props.loadingId }
      : {
          variant: "multi" as const,
          items,
          selectedIds: props.selectedIds,
          onToggle: props.onToggle,
        };

  return (
    <>
      {showError ? (
        <p className={errorPClass} role="alert">
          {props.error}
        </p>
      ) : null}
      {showEmpty ? (
        <p className={emptyPClass}>{emptyMessage}</p>
      ) : (
        <SelectableItemListRows {...rowsProps} />
      )}
    </>
  );
}
