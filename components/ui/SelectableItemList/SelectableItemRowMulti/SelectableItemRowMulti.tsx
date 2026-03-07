"use client";

import { Checkbox } from "@/components/ui/Checkbox/Checkbox";

export type SelectableItem = {
  id: string;
  initial: string;
  label: string;
};

type SelectableItemRowMultiProps = {
  item: SelectableItem;
  isSelected: boolean;
  onToggle: (id: string) => void;
};

export function SelectableItemRowMulti({
  item,
  isSelected,
  onToggle,
}: SelectableItemRowMultiProps) {
  return (
    <li>
      <label className="flex cursor-pointer items-center gap-3 rounded-xl content-px py-3 transition-colors hover:bg-(--bg) focus-within:ring-2 focus-within:ring-accent">
        <Checkbox
          checked={isSelected}
          onChange={() => onToggle(item.id)}
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
}
