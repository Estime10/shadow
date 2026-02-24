"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { mainNavItems } from "@/lib/navigation";

export function AppNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-10 border-t-2 border-[var(--accent)] bg-[var(--bg)]/95 shadow-[var(--shadow-accent-nav)] backdrop-blur"
      aria-label="Navigation principale"
    >
      <div className="mx-auto flex max-w-3xl items-center justify-around px-2 py-2">
        {mainNavItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`relative flex flex-col items-center gap-0.5 px-4 pt-2 pb-3 font-display text-xs font-bold uppercase tracking-wider transition-colors ${
                isActive
                  ? "text-[var(--accent)]"
                  : "text-[var(--text-muted)] hover:text-[var(--text)]"
              }`}
              aria-current={isActive ? "page" : undefined}
            >
              <span>{item.label}</span>
              {isActive ? (
                <span className="absolute bottom-0 left-1/2 h-0.5 w-8 -translate-x-1/2 bg-[var(--accent)]" aria-hidden />
              ) : null}
              {item.badge != null && item.badge > 0 ? (
                <span
                  className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center bg-[var(--error)] px-1 text-[10px] font-bold text-[var(--bg)]"
                  aria-label={`${item.badge} nouvelles notifications`}
                >
                  {item.badge > 99 ? "99+" : item.badge}
                </span>
              ) : null}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
