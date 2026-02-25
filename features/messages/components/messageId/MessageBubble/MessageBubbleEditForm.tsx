"use client";

import { useState } from "react";
import { updateMessageAction } from "@/features/messages/actions";
import { MAX_MESSAGE_LENGTH } from "@/features/messages/constants";

type MessageBubbleEditFormProps = {
  messageId: string;
  initialText: string;
  onCancel: () => void;
};

export function MessageBubbleEditForm({
  messageId,
  initialText,
  onCancel,
}: MessageBubbleEditFormProps) {
  const [editText, setEditText] = useState(initialText);

  return (
    <div className="flex w-full justify-end">
      <form
        action={async (formData) => {
          await updateMessageAction(formData);
        }}
        className="flex w-full max-w-[min(85%,20rem)] flex-col gap-2 rounded-2xl rounded-br-md bg-(--accent)/15 px-4 py-2.5"
      >
        <input type="hidden" name="messageId" value={messageId} />
        <textarea
          name="text"
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          maxLength={MAX_MESSAGE_LENGTH}
          rows={2}
          className="min-h-10 w-full min-w-0 resize-none rounded bg-(--bg)/80 font-display text-sm text-(--text) focus:outline-none"
          required
        />
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="rounded px-2 py-1 text-xs font-medium text-(--text-muted)"
          >
            Annuler
          </button>
          <button
            type="submit"
            className="rounded bg-accent px-2 py-1 font-display text-xs font-bold uppercase text-(--bg)"
          >
            Enregistrer
          </button>
        </div>
      </form>
    </div>
  );
}
