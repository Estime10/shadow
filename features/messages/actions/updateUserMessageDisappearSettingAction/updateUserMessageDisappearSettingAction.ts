"use server";

import { revalidatePath } from "next/cache";
import { PATHS } from "@/lib/config/paths";
import { updateUserMessageDisappearSetting } from "@/lib/supabase/CRUD";
import type { MessageDisappearAfterMinutes } from "@/lib/supabase/CRUD";

/**
 * Met à jour le réglage "disparition après lecture" (dropdown paramètres Messages).
 */
export async function updateUserMessageDisappearSettingAction(
  minutes: MessageDisappearAfterMinutes
): Promise<{ ok: boolean; error: string | null }> {
  const result = await updateUserMessageDisappearSetting(minutes);
  if (result.ok) revalidatePath(PATHS.MESSAGES);
  return result;
}
