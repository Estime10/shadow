"use client";

import { useEffect } from "react";
import { SectionWithTitle } from "@/components/layout/SectionWithTitle/SectionWithTitle";
import { useNotifications } from "@/lib/contexts/NotificationsContext/NotificationsContext";
import type { Notification } from "@/features/notifications/types/notification";
import { NotificationList } from "../NotificationList/NotificationList";

type NotificationsViewProps = {
  notifications: Notification[];
};

function getUnreadCount(notifications: Notification[]): number {
  return notifications.filter((n) => !n.read).length;
}

export function NotificationsView({ notifications }: NotificationsViewProps) {
  const { setUnreadCount } = useNotifications();

  useEffect(() => {
    setUnreadCount(getUnreadCount(notifications));
  }, [notifications, setUnreadCount]);

  return (
    <SectionWithTitle title="Notifications">
      <NotificationList notifications={notifications} />
    </SectionWithTitle>
  );
}
