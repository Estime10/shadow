import Link from "next/link";
import { APP_NAME } from "@/types/navigation";
import { getCurrentUserProfile } from "@/lib/supabase/getCurrentUserProfile";
import { HeaderAuth } from "./HeaderAuth/HeaderAuth";

export async function AppHeader() {
  const profile = await getCurrentUserProfile();

  return (
    <header className="sticky top-0 z-10 rounded-b-xl border-b-2 border-accent bg-(--bg)/95 shadow-(--shadow-accent-header) backdrop-blur">
      <div className="mx-auto flex h-14 max-w-3xl items-center justify-between px-4">
        <Link
          href="/"
          className="font-display text-lg font-bold uppercase tracking-wider text-(--text)"
        >
          {APP_NAME}
        </Link>
        <nav className="flex items-center gap-4">
          <HeaderAuth profile={profile} />
        </nav>
      </div>
    </header>
  );
}
