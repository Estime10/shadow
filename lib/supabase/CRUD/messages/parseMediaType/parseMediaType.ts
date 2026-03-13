import type { MessageMediaType } from "@/types/message";

/**
 * Parse une chaîne media_type (DB ou Realtime) en MessageMediaType.
 * Source unique pour les mappers messages (DRY).
 */
export function parseMediaType(mediaType: string | null): MessageMediaType | null {
  if (mediaType === "image" || mediaType === "video") return mediaType;
  return null;
}
