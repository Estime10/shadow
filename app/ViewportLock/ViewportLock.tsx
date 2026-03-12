"use client";

import { Children } from "react";
import { usePathname } from "next/navigation";

type ViewportLockProps = {
  children: React.ReactNode;
};

const BASE_CLASS = "flex flex-col pb-20";
const HOME_CLASS = "h-dvh overflow-hidden";
const DEFAULT_CLASS = "min-h-screen";

/**
 * Sur la home : fixe la hauteur au viewport (100dvh) et désactive le scroll.
 * Sur les autres pages : comportement normal (min-h-screen).
 */
export function ViewportLock({ children }: ViewportLockProps) {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const className = `${BASE_CLASS} ${isHome ? HOME_CLASS : DEFAULT_CLASS}`;

  if (isHome) {
    const arr = Children.toArray(children);
    const [content, ...rest] = arr;
    return (
      <div className={className}>
        <div className="min-h-0 flex-1 overflow-hidden">{content}</div>
        {rest}
      </div>
    );
  }

  return <div className={className}>{children}</div>;
}
