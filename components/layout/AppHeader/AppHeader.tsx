import Link from "next/link";
import { APP_NAME } from "@/types/navigation";

export function AppHeader() {
  return (
    <header className="sticky top-0 z-10 border-b-2 border-[var(--accent)] bg-[var(--bg)]/95 shadow-[var(--shadow-accent-header)] backdrop-blur">
      <div className="mx-auto flex h-14 max-w-3xl items-center justify-between px-4">
        <Link
          href="/"
          className="font-display text-lg font-bold uppercase tracking-wider text-[var(--text)] hover:text-[var(--accent)] transition-colors"
        >
          {APP_NAME}
        </Link>
        <nav className="flex items-center gap-4">
          <Link
            href="/login"
            className="font-display text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors"
          >
            Connexion
          </Link>
        </nav>
      </div>
    </header>
  );
}
