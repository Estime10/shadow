"use client";

import { usePathname } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import { ANIMATION_DURATION_NORMAL, ANIMATION_EASING } from "@/lib/config/animations";

type MessagesViewTransitionProps = {
  children: React.ReactNode;
};

export function MessagesViewTransition({ children }: MessagesViewTransitionProps) {
  const pathname = usePathname();
  const reduced = useReducedMotion();
  const isConversation = /^\/messages\/[^/]+$/.test(pathname);

  return (
    <motion.div
      key={pathname}
      className="flex min-h-0 flex-1 flex-col"
      initial={reduced ? false : isConversation ? { opacity: 0, x: 12 } : { opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={
        reduced ? { duration: 0 } : { duration: ANIMATION_DURATION_NORMAL, ease: ANIMATION_EASING }
      }
    >
      {children}
    </motion.div>
  );
}
