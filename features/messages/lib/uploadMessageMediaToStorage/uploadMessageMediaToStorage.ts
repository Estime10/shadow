"use client";

import { createClient } from "@/lib/supabase/client";
import { MEDIA_BUCKET } from "@/lib/supabase/constants";
import { log } from "@/lib/logger/logger";
import type { MessageMediaType } from "@/types";

export type UploadMessageMediaResult =
  | { success: true; path: string; mediaId: string; type: MessageMediaType }
  | { success: false; error: string };

/**
 * Upload un fichier image (ou vidéo) vers le bucket media.
 * Chemin : {userId}/image/{mediaId} ou {userId}/video/{mediaId}.
 * À appeler côté client avec un userId authentifié.
 */
export async function uploadMessageMediaToStorage(
  file: File,
  userId: string,
  type: MessageMediaType
): Promise<UploadMessageMediaResult> {
  log("messages-upload", "Début upload", { name: file.name, size: file.size, type });

  const mediaId = crypto.randomUUID();
  const path = `${userId}/${type}/${mediaId}`;

  const supabase = createClient();
  const { error } = await supabase.storage.from(MEDIA_BUCKET).upload(path, file, {
    cacheControl: "3600",
    upsert: false,
  });

  if (error) {
    log("messages-upload", "Erreur upload Storage", { error });
    return { success: false, error: error.message };
  }

  log("messages-upload", "Upload réussi", { path, mediaId });
  return { success: true, path, mediaId, type };
}
