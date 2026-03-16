"use client";

import { useEffect } from "react";
import { useSWRConfig } from "swr";
import { createClient } from "@/lib/supabase/client";

/**
 * Au retour sur l’onglet (visibilitychange → visible), rafraîchit la session Supabase
 * puis déclenche une revalidation SWR. Évite les "failed to fetch" dus à un token
 * expiré quand l’utilisateur revient après un moment (onglet en arrière-plan).
 */
export function RefreshSessionOnVisibility() {
  const { mutate } = useSWRConfig();

  useEffect(() => {
    if (typeof document === "undefined") return;

    const handleVisibility = (): void => {
      if (document.visibilityState !== "visible") return;
      const supabase = createClient();
      supabase.auth
        .refreshSession()
        .then(() => {
          mutate(() => true);
        })
        .catch(() => {
          mutate(() => true);
        });
    };

    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, [mutate]);

  return null;
}
