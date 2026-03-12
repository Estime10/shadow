"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { mainNavItems } from "@/lib/navigation/navigation";
import { useNotificationsUnreadCount } from "@/lib/contexts/NotificationsContext/NotificationsContext";

const MESSAGES_HREF = "/messages";

export function AppNav() {
  const pathname = usePathname();
  const messagesUnreadCount = useNotificationsUnreadCount();

  return (
    <nav
      className="safe-area-bottom fixed bottom-0 left-0 right-0 z-10 rounded-t-xl border-t-2 border-accent bg-(--bg)/95 shadow-(--shadow-accent-nav) backdrop-blur"
      aria-label="Navigation principale"
    >
      <div className="content-max-w flex items-center justify-around content-px py-2">
        {mainNavItems.map((item) => {
          const isActive = pathname === item.href;
          const badge = item.href === MESSAGES_HREF ? messagesUnreadCount : item.badge;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`relative flex flex-col items-center gap-0.5 px-4 pt-2 pb-3 font-display text-xs font-bold uppercase tracking-wider ${
                isActive ? "text-accent" : "text-(--text)"
              }`}
              aria-current={isActive ? "page" : undefined}
            >
              <span>{item.label}</span>
              {isActive ? (
                <span
                  className="absolute bottom-0 left-1/2 h-0.5 w-8 -translate-x-1/2 bg-accent"
                  aria-hidden
                />
              ) : null}
              {badge != null && badge > 0 ? (
                <span
                  className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-(--error) px-1 text-[10px] font-bold text-(--bg)"
                  aria-label={
                    item.href === MESSAGES_HREF
                      ? `${badge} message${badge > 1 ? "s" : ""} non lu${badge > 1 ? "s" : ""}`
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
