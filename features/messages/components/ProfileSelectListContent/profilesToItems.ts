import type { Profile } from "@/lib/supabase/CRUD";
import type { SelectableItem } from "@/components/ui/SelectableItemList/SelectableItemList";

export function profilesToItems(
  profiles: Profile[],
  getInitial: (username: string | null | undefined) => string,
  fallbackUsername: string
): SelectableItem[] {
  return profiles.map((p) => ({
    id: p.id,
    initial: getInitial(p.username),
    label: p.username ?? fallbackUsername,
  }));
}
