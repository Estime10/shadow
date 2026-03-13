import type { MessageMediaType } from "@/types";

/**
 * Déduit le type de média (image | video) à partir du MIME du fichier.
 */
export function getMediaTypeFromFile(file: File): MessageMediaType {
  if (file.type.startsWith("video/")) return "video";
  return "image";
}
