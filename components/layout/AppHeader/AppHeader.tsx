import Link from "next/link";
import { APP_NAME } from "@/types/navigation";

export function AppHeader() {
  return (
    <header className="sticky top-0 z-10 rounded-b-xl border-b-2 border-accent bg-(--bg)/95 shadow-(--shadow-accent-header) backdrop-blur">
      <div className="mx-auto flex h-14 max-w-3xl items-center justify-between px-4">
        <Link
          href="/"
          className="font-display text-lg font-bold uppercase tracking-wider text-(--text) hover:text-accent transition-colors"
        >
          {APP_NAME}
        </Link>
        <nav className="flex items-center gap-4">
          <Link
            href="/login"
            className="font-display text-xs font-bold uppercase tracking-wider text-(--text-muted) hover:text-accent transition-colors"
          >
            Connexion
          </Link>
        </nav>
      </div>
    </header>
  );
}
