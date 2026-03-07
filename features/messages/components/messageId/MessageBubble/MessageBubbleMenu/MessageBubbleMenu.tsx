"use client";

import { ConfirmModal } from "@/components/ui/ConfirmModal/ConfirmModal";
import type { ThreadCacheKey } from "@/lib/hooks/messages";
import { MessageBubbleMenuList } from "./MessageBubbleMenuList/MessageBubbleMenuList";
import { useMessageBubbleMenuConfirm } from "./useMessageBubbleMenuConfirm/useMessageBubbleMenuConfirm";

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
  const { confirmDeleteOpen, setConfirmDeleteOpen, handleConfirmDelete } =
    useMessageBubbleMenuConfirm({
      messageId,
      conversationId,
      onClose,
      threadCacheKey,
    });

  function handleEditClick() {
    onEdit();
    onClose();
  }

  return (
    <>
      <MessageBubbleMenuList
        onEdit={handleEditClick}
        onDeleteClick={() => setConfirmDeleteOpen(true)}
      />
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
