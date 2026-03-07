"use client";

import { MAX_MESSAGE_LENGTH } from "@/features/messages/constants";

type MessageBubbleEditFormFieldsProps = {
  value: string;
  onChange: (value: string) => void;
};

export function MessageBubbleEditFormFields({ value, onChange }: MessageBubbleEditFormFieldsProps) {
  return (
    <textarea
      name="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      maxLength={MAX_MESSAGE_LENGTH}
      rows={2}
      className="min-h-10 w-full min-w-0 resize-none rounded bg-(--bg)/80 font-display text-sm text-(--text) focus:outline-none"
      required
    />
  );
}
