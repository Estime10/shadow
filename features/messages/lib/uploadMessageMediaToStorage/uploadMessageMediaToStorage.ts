"use client";

import { createClient } from "@/lib/supabase/client";
import type { MessageMediaType } from "@/types";
import { messagesLogger } from "../logger/logger";

const BUCKET = "media";

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
  messagesLogger.upload("Début upload", { name: file.name, size: file.size, type });

  const mediaId = crypto.randomUUID();
  const path = `${userId}/${type}/${mediaId}`;

  const supabase = createClient();
  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    cacheControl: "3600",
    upsert: false,
  });

  if (error) {
    messagesLogger.upload("Erreur upload Storage", error);
    return { success: false, error: error.message };
  }

  messagesLogger.upload("Upload réussi", { path, mediaId });
  return { success: true, path, mediaId, type };
}
