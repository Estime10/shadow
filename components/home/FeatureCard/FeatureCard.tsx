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

export function FeatureCard({ href, title, description, icon, className = "" }: FeatureCardProps) {
  return (
    <article
      className={`relative flex min-h-0 flex-col overflow-hidden rounded-xl bg-surface shadow-(--shadow-accent) lg:min-h-0 ${className}`}
    >
      {/* Bandeau accent gauche */}
      <span className="absolute left-0 top-0 h-full w-1 bg-accent opacity-80" aria-hidden />

      <div className="flex min-w-0 flex-1 flex-col p-5 pl-6">
        {/* Header: icône + titre */}
        <div className="flex items-center gap-4">
          {icon ? (
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-(--bg) text-accent shadow-inner">
              {icon}
            </span>
          ) : null}
          <h2 className="font-display text-xl font-bold uppercase tracking-[0.2em] text-(--text)">
            {title}
          </h2>
        </div>

        {/* Description */}
        <p className="mt-4 flex-1 text-sm leading-relaxed text-(--text-muted)">{description}</p>

        {/* CTA : seule zone cliquable, cursor-pointer uniquement au-dessus de md */}
        <div className="mt-5 flex items-center justify-end gap-2 pt-4">
          <Link
            href={href}
            className="inline-flex md:cursor-pointer items-center gap-2 rounded-lg py-1 pr-1 transition-colors md:hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            aria-label={`Ouvrir ${title}`}
          >
            <span className="font-display text-xs font-bold uppercase tracking-widest text-accent">
              Ouvrir
            </span>
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-accent/20 text-accent">
              <ChevronRight className="h-4 w-4" aria-hidden />
            </span>
          </Link>
        </div>
      </div>
    </article>
  );
}
