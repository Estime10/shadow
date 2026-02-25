export type SectionWithTitleProps = {
  title: string;
  children: React.ReactNode;
};

/**
 * Bloc : barre accent + titre + contenu (ex. pages Calendrier, Notifications).
 */
export function SectionWithTitle({ title, children }: SectionWithTitleProps) {
  return (
    <>
      <div className="mb-2 h-1 w-12 bg-[var(--accent)]" />
      <h1 className="font-display text-2xl font-bold uppercase tracking-wider text-[var(--text)]">
        {title}
      </h1>
      <div className="mt-4 text-sm text-[var(--text-muted)]">{children}</div>
    </>
  );
}
