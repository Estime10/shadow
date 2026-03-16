"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { mainNavItems } from "@/lib/navigation/navigation";
import { useCalendarBadgeCount } from "@/lib/contexts/CalendarBadgeContext/CalendarBadgeContext";
import { useNotificationsUnreadCount } from "@/lib/contexts/NotificationsContext/NotificationsContext";

const MESSAGES_HREF = "/messages";
const CALENDAR_HREF = "/calendar";

export function AppNav() {
  const pathname = usePathname();
  const messagesUnreadCount = useNotificationsUnreadCount();
  const calendarUpcomingCount = useCalendarBadgeCount();

  const getBadge = (href: string) => {
    if (href === MESSAGES_HREF) return messagesUnreadCount;
    if (href === CALENDAR_HREF) return calendarUpcomingCount;
    return null;
  };

  return (
    <nav
      className="safe-area-bottom fixed bottom-0 left-0 right-0 z-10 rounded-t-xl
       border-t-2 border-accent bg-(--bg)/95 shadow-(--shadow-accent-nav) backdrop-blur"
      aria-label="Navigation principale"
    >
      <div className="content-max-w flex items-center justify-around content-px py-2">
        {mainNavItems.map((item) => {
          const isActive = pathname === item.href;
          const badge = item.badge ?? getBadge(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`relative flex flex-col items-center justify-center gap-0.5 px-4 py-3 font-display text-xs font-bold uppercase tracking-wider md:pt-2 md:pb-3 ${
                isActive ? "text-accent" : "text-(--text)"
              }`}
              aria-current={isActive ? "page" : undefined}
              aria-label={item.label}
            >
              {Icon ? <Icon className="h-5 w-5 shrink-0" aria-hidden /> : null}
              <span className="hidden md:block">{item.label}</span>
              {isActive ? (
                <span
                  className="absolute bottom-0 left-1/2 h-0.5 w-8 -translate-x-1/2 bg-accent"
                  aria-hidden
                />
              ) : null}
              {badge != null && badge > 0 ? (
                <span
                  className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center text-[12px] font-bold text-(--error)"
                  aria-label={
                    item.href === MESSAGES_HREF
                      ? `${badge} message${badge > 1 ? "s" : ""} non lu${badge > 1 ? "s" : ""}`
                      : item.href === CALENDAR_HREF
                        ? `${badge} événement${badge > 1 ? "s" : ""} à venir`
                        : `${badge} nouvelles notifications`
                  }
                >
                  {badge > 99 ? "99+" : badge}
                </span>
              ) : null}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
