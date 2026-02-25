"use client";

import { useState, useRef, useEffect } from "react";
import { MoreVertical, Pencil, Trash2 } from "lucide-react";
import { formatRelativeTime } from "@/lib/functions";
import { updateMessageAction, deleteMessageAction } from "@/features/messages/actions";
import type { MessageBubbleProps } from "@/features/messages/types";

export function MessageBubble({ message, currentUserId }: MessageBubbleProps) {
  const isSent = currentUserId != null && message.senderId === currentUserId;
  const [menuOpen, setMenuOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(message.text);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    const close = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, [menuOpen]);

  const handleEdit = () => {
    setMenuOpen(false);
    setEditText(message.text);
    setIsEditing(true);
  };

  if (isEditing) {
    return (
      <div className="flex w-full justify-end">
        <form
          action={async (formData) => {
            await updateMessageAction(formData);
          }}
          className="flex max-w-[85%] flex-col gap-2 rounded-2xl rounded-br-md bg-(--accent)/15 px-4 py-2.5"
        >
          <input type="hidden" name="messageId" value={message.id} />
          <textarea
            name="text"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            rows={2}
            className="min-h-10 w-full resize-none rounded bg-(--bg)/80 font-display text-sm text-(--text) focus:outline-none"
            required
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
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

  return (
    <div className={`flex w-full ${isSent ? "justify-end" : "justify-start"}`}>
      <div
        className={`group relative max-w-[85%] rounded-2xl px-4 py-2.5 ${
          isSent
            ? "rounded-br-md bg-(--accent)/15 text-(--text)"
            : "rounded-bl-md bg-surface text-(--text)"
        }`}
      >
        {isSent ? (
          <div
            className="absolute -top-1 right-2 opacity-0 transition-opacity group-hover:opacity-100"
            ref={menuRef}
          >
            <button
              type="button"
              onClick={() => setMenuOpen((o) => !o)}
              className="rounded p-1 hover:bg-(--bg)/20"
              aria-label="Options"
            >
              <MoreVertical className="h-4 w-4" />
            </button>
            {menuOpen ? (
              <div className="absolute right-0 top-full z-10 mt-1 min-w-32 rounded-lg border-2 border-(--border) bg-surface py-1 shadow-lg">
                <button
                  type="button"
                  onClick={handleEdit}
                  className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-(--bg)"
                >
                  <Pencil className="h-3.5 w-3.5" /> Modifier
                </button>
                <form
                  action={async (formData) => {
                    await deleteMessageAction(formData);
                  }}
                >
                  <input type="hidden" name="messageId" value={message.id} />
                  <button
                    type="submit"
                    className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-red-600 hover:bg-(--bg)"
                  >
                    <Trash2 className="h-3.5 w-3.5" /> Supprimer
                  </button>
                </form>
              </div>
            ) : null}
          </div>
        ) : null}
        <p className="text-sm leading-relaxed">{message.text}</p>
        <span
          className={`mt-1 block text-[10px] ${isSent ? "text-accent" : "text-(--text-muted)"}`}
        >
          {formatRelativeTime(message.createdAt)}
        </span>
      </div>
    </div>
  );
}
