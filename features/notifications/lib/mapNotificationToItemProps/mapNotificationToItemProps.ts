import type { Notification } from "@/features/notifications/types/notification";
import type { NotificationItemProps } from "@/features/notifications/types/notificationItemProps";
import { getNotificationIconType } from "../getNotificationIconType/getNotificationIconType";
import { formatRelativeTime } from "@/lib/functions";

/**
 * Transforme une Notification en props présentatives pour NotificationItem.
 * Centralise la logique de formatage et de dérivation (date, icône).
 */
export function mapNotificationToItemProps(notification: Notification): NotificationItemProps {
  return {
    title: notification.title,
    description: notification.description,
    timeFormatted: formatRelativeTime(notification.createdAt),
    read: notification.read ?? false,
    href: notification.href,
    iconType: getNotificationIconType(notification),
  };
}
