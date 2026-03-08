"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { NotificationItemProps } from "@/features/notifications/types/notificationItemProps";
import { NotificationItemIcon } from "./NotificationItemIcon/NotificationItemIcon";

/**
 * Composant présentatif : affiche une ligne de notification.
 * Seul le chevron (arrow right) est cliquable pour ouvrir le lien, comme dans la liste des conversations.
 */
export function NotificationItem({
  title,
  description,
  timeFormatted,
  read,
  href,
  iconType,
}: NotificationItemProps) {
  const baseClassName =
    "mx-2 flex w-full items-start gap-3 rounded-xl bg-(--surface) content-px py-3 text-left";

  return (
    <div className={baseClassName}>
      <NotificationItemIcon iconType={iconType} />
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <span
            className={`font-display text-sm font-bold uppercase tracking-wider ${
              read ? "text-(--text-muted)" : "text-(--text)"
            }`}
          >
            {title}
          </span>
          <span className="shrink-0 text-xs text-(--text-muted)">{timeFormatted}</span>
        </div>
        <p className="mt-0.5 line-clamp-2 text-sm text-(--text-muted)">{description}</p>
      </div>
      {href ? (
        <Link
          href={href}
          className="inline-flex md:cursor-pointer items-center justify-center rounded-lg p-0.5 transition-colors md:hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          aria-label={`Ouvrir : ${title}`}
        >
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent/20 text-accent">
            <ChevronRight className="h-4 w-4" aria-hidden />
          </span>
        </Link>
      ) : null}
    </div>
  );
}
