import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { MessageIdHeaderProps } from "../../../types/props";

export function MessageIdHeader({ conversation }: MessageIdHeaderProps) {
  return (
    <div className="flex shrink-0 items-center justify-between bg-[var(--surface)] px-4 py-3 lg:px-6">
      <Link
        href="/messages"
        className="flex items-center gap-2 text-[var(--accent)] transition-opacity hover:opacity-80"
        aria-label="Retour aux messages"
      >
        <ArrowLeft className="h-5 w-5 shrink-0" aria-hidden />
        <span className="font-display text-xs font-bold uppercase tracking-wider">Retour</span>
      </Link>
      <h1 className="font-display text-xl font-bold uppercase tracking-wider text-[var(--text)]">
        {conversation.participant.name}
      </h1>
    </div>
  );
}
