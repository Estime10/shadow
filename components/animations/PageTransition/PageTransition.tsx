"use client";

import { usePathname } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import { ANIMATION_DURATION_NORMAL, ANIMATION_EASING } from "@/lib/config/animations";

type PageTransitionProps = {
  children: React.ReactNode;
};

export function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();
  const reduced = useReducedMotion();

  return (
    <motion.div
      key={pathname}
      initial={reduced ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={
        reduced ? { duration: 0 } : { duration: ANIMATION_DURATION_NORMAL, ease: ANIMATION_EASING }
      }
      className="flex min-h-0 flex-1 flex-col"
    >
      {children}
    </motion.div>
  );
}
