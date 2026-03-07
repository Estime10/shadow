"use client";

import type { SelectableItem } from "./SelectableItemRowSingle/SelectableItemRowSingle";
import { SelectableItemListContent } from "./SelectableItemListContent/SelectableItemListContent";

export type { SelectableItem } from "./SelectableItemRowSingle/SelectableItemRowSingle";

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
      {props.variant === "single" ? (
        <SelectableItemListContent
          variant="single"
          items={items}
          emptyMessage={emptyMessage}
          onSelect={props.onSelect}
          loadingId={props.loadingId}
          error={props.error}
        />
      ) : (
        <SelectableItemListContent
          variant="multi"
          items={items}
          emptyMessage={emptyMessage}
          selectedIds={props.selectedIds}
          onToggle={props.onToggle}
        />
      )}
    </div>
  );
}
