"use client";

import { createClient } from "@/lib/supabase/client";
import { MEDIA_BUCKET } from "@/lib/supabase/constants";

const EXPIRES_IN = 3600;

export type GetSignedMediaUrlResult =
  | { success: true; url: string }
  | { success: false; error: string };

/**
 * Récupère une URL signée pour afficher un fichier du bucket media (privé).
 * Une seule responsabilité ; utilisé par le hook useSignedMediaUrl.
 */
export async function getSignedMediaUrl(storagePath: string): Promise<GetSignedMediaUrlResult> {
  const supabase = createClient();
  const { data, error } = await supabase.storage
    .from(MEDIA_BUCKET)
    .createSignedUrl(storagePath.trim(), EXPIRES_IN);

  if (error) return { success: false, error: error.message };
  if (data?.signedUrl) return { success: true, url: data.signedUrl };
  return { success: false, error: "URL non disponible" };
}
