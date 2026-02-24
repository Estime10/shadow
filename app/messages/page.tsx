import { AppHeader } from "@/components/layout/AppHeader";
import { AppNav } from "@/components/layout/AppNav";
import { MessengerView } from "@/features/messages";

export const metadata = {
  title: "Messages — Ghost Riders",
  description: "Messages éphémères 24h",
};

export default function MessagesPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[var(--bg)] pb-20 lg:h-screen lg:overflow-hidden">
      <AppHeader />

      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-0 lg:min-h-0 lg:px-0">
        <div className="flex shrink-0 items-center gap-2 px-4 py-3 lg:px-6">
          <div className="h-1 w-8 bg-[var(--accent)]" />
          <h1 className="font-display text-xl font-bold uppercase tracking-wider text-[var(--text)]">
            Messages
          </h1>
        </div>

        <div className="flex-1 min-h-0">
          <MessengerView />
        </div>
      </main>

      <AppNav />
    </div>
  );
}
