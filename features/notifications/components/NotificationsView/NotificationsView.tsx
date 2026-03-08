"use client";

import { SectionWithTitle } from "@/components/layout/SectionWithTitle/SectionWithTitle";
import type { Notification } from "@/features/notifications/types/notification";
import { NotificationList } from "../NotificationList/NotificationList";

type NotificationsViewProps = {
  notifications: Notification[];
};

export function NotificationsView({ notifications }: NotificationsViewProps) {
  return (
    <SectionWithTitle title="Notifications">
      <NotificationList notifications={notifications} />
    </SectionWithTitle>
  );
}
