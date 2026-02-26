"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Trash2 } from "lucide-react";
import { ConfirmModal } from "@/components/ui/ConfirmModal/ConfirmModal";
import { deleteMessageAction } from "@/features/messages/actions";

type MessageBubbleMenuProps = {
  messageId: string;
  conversationId: string;
  onEdit: () => void;
  onClose: () => void;
};

export function MessageBubbleMenu({
  messageId,
  conversationId,
  onEdit,
  onClose,
}: MessageBubbleMenuProps) {
  const router = useRouter();
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

  async function handleConfirmDelete() {
    const formData = new FormData();
    formData.set("messageId", messageId);
    formData.set("conversationId", conversationId);
    const { error, conversationDeleted } = await deleteMessageAction(formData);
    setConfirmDeleteOpen(false);
    onClose();
    if (!error) {
      if (conversationDeleted) {
        router.replace("/messages");
      } else {
        router.refresh();
      }
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
