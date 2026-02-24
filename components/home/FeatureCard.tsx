import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { ReactNode } from "react";

type FeatureCardProps = {
  href: string;
  title: string;
  description: string;
  icon?: ReactNode;
  className?: string;
};

export function FeatureCard({
  href,
  title,
  description,
  icon,
  className = "",
}: FeatureCardProps) {
  return (
    <Link
      href={href}
      className={`group relative flex min-h-0 flex-col overflow-hidden rounded-xl bg-[var(--surface)] shadow-[var(--shadow-accent)] transition-all duration-300 lg:min-h-0 ${className}`}
    >
      {/* Bandeau accent gauche */}
      <span
        className="absolute left-0 top-0 h-full w-1 bg-[var(--accent)] opacity-80 group-hover:opacity-100 group-hover:w-1.5 transition-all duration-300"
        aria-hidden
      />

      <div className="flex min-w-0 flex-1 flex-col p-5 pl-6">
        {/* Header: icône + titre */}
        <div className="flex items-center gap-4">
          {icon ? (
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-[var(--bg)] text-[var(--accent)] shadow-inner group-hover:bg-[var(--accent)]/10 group-hover:scale-105 transition-all duration-300">
              {icon}
            </span>
          ) : null}
          <h2 className="font-display text-xl font-bold uppercase tracking-[0.2em] text-[var(--text)] group-hover:text-[var(--accent)] transition-colors duration-300">
            {title}
          </h2>
        </div>

        {/* Description */}
        <p className="mt-4 flex-1 text-sm leading-relaxed text-[var(--text-muted)]">
          {description}
        </p>

        {/* CTA */}
        <div className="mt-5 flex items-center justify-end gap-2 pt-4 transition-colors duration-300">
          <span className="font-display text-xs font-bold uppercase tracking-widest text-[var(--accent)]">
            Ouvrir
          </span>
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--accent)]/20 text-[var(--accent)] group-hover:bg-[var(--accent)] group-hover:text-[var(--bg)] transition-all duration-300">
            <ChevronRight className="h-4 w-4" aria-hidden />
          </span>
        </div>
      </div>
    </Link>
  );
}
