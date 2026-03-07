"use client";

import type { SelectableItem } from "../SelectableItemRowSingle/SelectableItemRowSingle";
import { SelectableItemListInner } from "./SelectableItemListInner/SelectableItemListInner";

type SelectableItemListContentSingle = {
  variant: "single";
  items: SelectableItem[];
  emptyMessage: string;
  onSelect: (id: string) => void;
  loadingId?: string | null;
  error?: string | null;
};

type SelectableItemListContentMulti = {
  variant: "multi";
  items: SelectableItem[];
  emptyMessage: string;
  selectedIds: Set<string>;
  onToggle: (id: string) => void;
};

type SelectableItemListContentProps =
  | SelectableItemListContentSingle
  | SelectableItemListContentMulti;

export function SelectableItemListContent(props: SelectableItemListContentProps) {
  const { items, emptyMessage } = props;

  return (
    <div className="min-h-0 flex-1 overflow-y-auto p-2">
      {props.variant === "single" ? (
        <SelectableItemListInner
          variant="single"
          items={items}
          emptyMessage={emptyMessage}
          onSelect={props.onSelect}
          loadingId={props.loadingId}
          error={props.error}
        />
      ) : (
        <SelectableItemListInner
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
