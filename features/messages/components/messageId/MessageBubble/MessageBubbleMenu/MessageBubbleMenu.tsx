"use client";

import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { useSWRConfig } from "swr";
import { ConfirmModal } from "@/components/ui/ConfirmModal/ConfirmModal";
import { deleteMessageAction } from "@/features/messages/actions";
import type { ThreadCacheKey } from "@/lib/hooks/messages";
import type { MessageIdPageContent } from "@/features/messages/types";

const MESSAGES_LIST_KEY = "messages-list";

type MessageBubbleMenuProps = {
  messageId: string;
  conversationId: string;
  onEdit: () => void;
  onClose: () => void;
  threadCacheKey?: ThreadCacheKey;
};

export function MessageBubbleMenu({
  messageId,
  conversationId,
  onEdit,
  onClose,
  threadCacheKey,
}: MessageBubbleMenuProps) {
  const { mutate } = useSWRConfig();
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

  async function handleConfirmDelete() {
    const formData = new FormData();
    formData.set("messageId", messageId);
    formData.set("conversationId", conversationId);
    const { error } = await deleteMessageAction(formData);
    setConfirmDeleteOpen(false);
    onClose();
    if (!error) {
      void mutate(MESSAGES_LIST_KEY);
      const key = threadCacheKey ?? ["thread", conversationId];
      void mutate(
        key,
        (current: MessageIdPageContent | undefined) =>
          current
            ? { ...current, messages: current.messages.filter((m) => m.id !== messageId) }
            : undefined,
        { revalidate: true }
      );
    }
  }

  return (
    <>
      <div className="absolute right-0 top-full z-10 mt-1 min-w-32 rounded-lg border-2 border-(--border) bg-surface py-1 shadow-lg">
        <button
          type="button"
          onClick={() => {
            onEdit();
            onClose();
          }}
          className="flex w-full items-center gap-2 content-px py-2 text-left text-sm hover:bg-(--bg)"
        >
          <Pencil className="h-3.5 w-3.5" /> Modifier
        </button>
        <button
          type="button"
          onClick={() => {
            setConfirmDeleteOpen(true);
          }}
          className="flex w-full items-center gap-2 content-px py-2 text-left text-sm text-red-600 hover:bg-(--bg)"
        >
          <Trash2 className="h-3.5 w-3.5" /> Supprimer
        </button>
      </div>
      <ConfirmModal
        open={confirmDeleteOpen}
        onClose={() => setConfirmDeleteOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Supprimer le message"
        message="Ce message sera définitivement supprimé."
        confirmLabel="Supprimer"
      />
    </>
  );
}
