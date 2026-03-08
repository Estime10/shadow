import type { NotificationIconType } from "./notificationIconType";

/**
 * Props présentatives pour NotificationItem.
 * Dérivées d'une Notification via mapNotificationToItemProps (logique métier en dehors du composant).
 */
export type NotificationItemProps = {
  title: string;
  description: string;
  timeFormatted: string;
  read: boolean;
  href?: string;
  iconType: NotificationIconType;
};
