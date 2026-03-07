"use client";

import type { Profile } from "@/lib/supabase/CRUD";
import {
  SelectableItemList,
  type SelectableItem,
} from "@/components/ui/SelectableItemList/SelectableItemList";
import type { ProfileSelectListContentProps } from "../types";

type ProfileSelectListBodyProps = ProfileSelectListContentProps & {
  items: SelectableItem[];
  emptyMessage: string;
  filteredProfiles: Profile[];
};

export function ProfileSelectListBody({
  items,
  emptyMessage,
  filteredProfiles,
  ...props
}: ProfileSelectListBodyProps) {
  if (props.mode === "direct") {
    return (
      <SelectableItemList
        variant="single"
        items={items}
        emptyMessage={emptyMessage}
        onSelect={(id) => {
          const profile = filteredProfiles.find((p) => p.id === id);
          if (profile) props.onSelectUser(profile);
        }}
        loadingId={props.creatingForProfileId ?? undefined}
        error={props.error ?? undefined}
      />
    );
  }
  return (
    <SelectableItemList
      variant="multi"
      items={items}
      emptyMessage={emptyMessage}
      selectedIds={props.selectedIds}
      onToggle={props.onToggleSelection}
      selectedCountLabel={props.selectedCountLabel}
    />
  );
}
