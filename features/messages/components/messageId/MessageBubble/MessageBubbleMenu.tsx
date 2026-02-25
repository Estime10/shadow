"use client";

import { Pencil, Trash2 } from "lucide-react";
import { deleteMessageAction } from "@/features/messages/actions";

type MessageBubbleMenuProps = {
  messageId: string;
  onEdit: () => void;
  onClose: () => void;
};

export function MessageBubbleMenu({ messageId, onEdit, onClose }: MessageBubbleMenuProps) {
  return (
    <div className="absolute right-0 top-full z-10 mt-1 min-w-32 rounded-lg border-2 border-(--border) bg-surface py-1 shadow-lg">
      <button
        type="button"
        onClick={() => {
          onEdit();
          onClose();
        }}
        className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-(--bg)"
      >
        <Pencil className="h-3.5 w-3.5" /> Modifier
      </button>
      <form
        action={async (formData) => {
          await deleteMessageAction(formData);
        }}
      >
        <input type="hidden" name="messageId" value={messageId} />
        <button
          type="submit"
          className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-red-600 hover:bg-(--bg)"
        >
          <Trash2 className="h-3.5 w-3.5" /> Supprimer
        </button>
      </form>
    </div>
  );
}
