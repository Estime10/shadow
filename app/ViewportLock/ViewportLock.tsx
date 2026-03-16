"use client";

import { Children } from "react";
import { usePathname } from "next/navigation";

type ViewportLockProps = {
  children: React.ReactNode;
};

export function ViewportLock({ children }: ViewportLockProps) {
  const pathname = usePathname();
  const isHome = pathname === "/";

  if (isHome) {
    const arr = Children.toArray(children);
    const [content, ...rest] = arr;
    return (
      <div className="viewport-lock--home">
        <div className="viewport-lock__content">{content}</div>
        {rest}
      </div>
    );
  }

  return <div className="viewport-lock--default">{children}</div>;
}
