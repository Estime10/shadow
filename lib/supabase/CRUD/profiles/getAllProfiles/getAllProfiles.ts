import { createClient } from "../../../server";
import type { Profile } from "../types/types";

/**
 * Récupère tous les profils (pour liste utilisateurs, etc.).
 */
export async function getAllProfiles(): Promise<Profile[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("users").select("id, username");

  if (error) return [];

  return (data ?? []).map((row) => ({
    id: row.id,
    username: row.username?.trim() ?? null,
  }));
}
