import { AppHeader } from "@/components/layout/AppHeader";
import { AppNav } from "@/components/layout/AppNav";

export const metadata = {
  title: "Notifications — Ghost Riders",
  description: "Notifications en temps réel",
};

export default function NotificationsPage() {
  return (
    <div className="min-h-screen bg-[var(--bg)] pb-20">
      <AppHeader />
      <main className="mx-auto max-w-3xl px-4 py-8">
        <div className="mb-2 h-1 w-12 bg-[var(--accent)]" />
        <h1 className="font-display text-2xl font-bold uppercase tracking-wider text-[var(--text)]">
          Notifications
        </h1>
        <p className="mt-4 text-sm text-[var(--text-muted)]">
          Badge et notifications realtime. (À brancher sur Supabase.)
        </p>
      </main>
      <AppNav />
    </div>
  );
}
