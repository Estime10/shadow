"use client";

import type { SelectableItem } from "@/types";
import { SelectableItemRowSingle } from "../../../SelectableItemRowSingle/SelectableItemRowSingle";
import { SelectableItemRowMulti } from "../../../SelectableItemRowMulti/SelectableItemRowMulti";

type SelectableItemListRowsSingle = {
  variant: "single";
  items: SelectableItem[];
  onSelect: (id: string) => void;
  loadingId?: string | null;
};

type SelectableItemListRowsMulti = {
  variant: "multi";
  items: SelectableItem[];
  selectedIds: Set<string>;
  onToggle: (id: string) => void;
};

type SelectableItemListRowsProps = SelectableItemListRowsSingle | SelectableItemListRowsMulti;

export function SelectableItemListRows(props: SelectableItemListRowsProps) {
  const { items } = props;
  return (
    <ul className="space-y-1" role="list">
      {items.map((item) =>
        props.variant === "single" ? (
          <SelectableItemRowSingle
            key={item.id}
            item={item}
            onSelect={props.onSelect}
            isLoading={props.loadingId === item.id}
            isDisabled={props.loadingId != null}
          />
        ) : (
          <SelectableItemRowMulti
            key={item.id}
            item={item}
            isSelected={props.selectedIds.has(item.id)}
            onToggle={props.onToggle}
          />
        )
      )}
    </ul>
  );
}
