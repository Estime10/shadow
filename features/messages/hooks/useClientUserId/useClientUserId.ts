"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

/**
 * Retourne l'id de l'utilisateur connecté côté client (auth Supabase).
 * Secours quand le serveur n'a pas fourni currentUserId (cache, délai cookies).
 */
export function useClientUserId(): string | null {
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();

    const sync = () => {
      supabase.auth.getUser().then(({ data: { user } }) => {
        setUserId(user?.id ?? null);
      });
    };

    sync();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      sync();
    });

    return () => subscription.unsubscribe();
  }, []);

  return userId;
}
