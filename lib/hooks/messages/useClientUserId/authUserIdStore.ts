"use client";

import { createClient } from "@/lib/supabase/client";

let current: string | null = null;
const listeners = new Set<() => void>();
let subscription: { unsubscribe: () => void } | null = null;

export function getAuthUserIdSnapshot(): string | null {
  return current;
}

export function subscribeAuthUserId(callback: () => void): () => void {
  listeners.add(callback);
  if (!subscription) {
    const supabase = createClient();
    const sync = () => {
      supabase.auth.getUser().then(({ data: { user } }) => {
        current = user?.id ?? null;
        listeners.forEach((l) => l());
      });
    };
    sync();
    const {
      data: { subscription: sub },
    } = supabase.auth.onAuthStateChange(sync);
    subscription = sub;
  }
  return () => {
    listeners.delete(callback);
    if (listeners.size === 0 && subscription) {
      subscription.unsubscribe();
      subscription = null;
    }
  };
}
