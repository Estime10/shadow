"use client";

import { MessageSquare, Image as ImageIcon, Video, Calendar, Users } from "lucide-react";
import type { NotificationIconType } from "@/features/notifications/types/notificationIconType";

type NotificationItemIconProps = {
  iconType: NotificationIconType;
};

const iconMap: Record<NotificationIconType, React.ReactNode> = {
  message: <MessageSquare className="h-5 w-5" aria-hidden />,
  image: <ImageIcon className="h-5 w-5" aria-hidden />,
  video: <Video className="h-5 w-5" aria-hidden />,
  event: <Calendar className="h-5 w-5" aria-hidden />,
  group_chat: <Users className="h-5 w-5" aria-hidden />,
};

export function NotificationItemIcon({ iconType }: NotificationItemIconProps) {
  return (
    <span
      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-(--bg) text-accent"
      aria-hidden
    >
      {iconMap[iconType]}
    </span>
  );
}
