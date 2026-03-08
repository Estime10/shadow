"use client";

import type { Notification } from "@/features/notifications/types/notification";
import { mapNotificationToItemProps } from "@/features/notifications/lib/mapNotificationToItemProps/mapNotificationToItemProps";
import { NotificationItem } from "../NotificationItem/NotificationItem";

type NotificationListProps = {
  notifications: Notification[];
};

export function NotificationList({ notifications }: NotificationListProps) {
  if (notifications.length === 0) {
    return (
      <p className="content-px py-8 text-center text-sm text-(--text-muted)">Aucune notification</p>
    );
  }

  return (
    <ul
      className="flex flex-col gap-2 overflow-x-hidden overflow-y-auto content-px pb-2"
      aria-label="Liste des notifications"
    >
      {notifications.map((notification) => (
        <li key={notification.id}>
          <NotificationItem {...mapNotificationToItemProps(notification)} />
        </li>
      ))}
    </ul>
  );
}
