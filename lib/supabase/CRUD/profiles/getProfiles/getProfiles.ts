import { createClient } from "../../../server";
import type { Profile } from "../types/types";

/**
 * Récupère les profils par liste d'ids (ex. pour afficher les expéditeurs des messages).
 */
export async function getProfiles(ids: string[]): Promise<Profile[]> {
  if (ids.length === 0) return [];

  const supabase = await createClient();
  const { data, error } = await supabase.from("users").select("id, username").in("id", ids);

  if (error) {
    console.error("[getProfiles] Supabase error:", error.message, { ids });
    return [];
  }

  return (data ?? []).map((row) => ({
    id: row.id,
    username: row.username?.trim() ?? null,
  }));
}

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
