"use client";

import { type ReactNode } from "react";
import { motion } from "framer-motion";
import { ANIMATION_EASING } from "@/lib/config/animations";
import { CreateGroupModalHeader } from "../../CreateGroupModalHeader/CreateGroupModalHeader";
import { CreateGroupModalFooter } from "../../CreateGroupModalFooter/CreateGroupModalFooter";

type CreateGroupModalViewPanelProps = {
  duration: number;
  onClose: () => void;
  canSubmit: boolean;
  creating: boolean;
  error: string | null;
  onCreateGroup: () => void;
  children: ReactNode;
};

export function CreateGroupModalViewPanel({
  duration,
  onClose,
  canSubmit,
  creating,
  error,
  onCreateGroup,
  children,
}: CreateGroupModalViewPanelProps) {
  return (
    <motion.div
      className="relative z-10 flex max-h-[85dvh] w-full max-w-md flex-col rounded-xl border-2 border-(--border) bg-surface shadow-xl"
      onClick={(e) => e.stopPropagation()}
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration, ease: ANIMATION_EASING }}
    >
      <CreateGroupModalHeader onClose={onClose} />
      <div className="flex min-h-0 flex-1 flex-col p-4">{children}</div>
      {error ? (
        <p className="shrink-0 px-4 pb-2 text-sm text-red-600" role="alert">
          {error}
        </p>
      ) : null}
      <CreateGroupModalFooter canSubmit={canSubmit} creating={creating} onSubmit={onCreateGroup} />
    </motion.div>
  );
}
