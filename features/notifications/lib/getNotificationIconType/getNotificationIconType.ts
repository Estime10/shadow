import type { Notification } from "@/features/notifications/types/notification";
import type { NotificationIconType } from "@/features/notifications/types/notificationIconType";

/**
 * Détermine le type d'icône à afficher pour une notification.
 * Logique métier : mapping kind + contentKind → icon type.
 */
export function getNotificationIconType(notification: Notification): NotificationIconType {
  if (notification.kind === "message") {
    if (notification.contentKind === "image") return "image";
    if (notification.contentKind === "video") return "video";
    return "message";
  }
  if (notification.kind === "event") return "event";
  if (notification.kind === "group_chat") return "group_chat";
  return "message";
}
