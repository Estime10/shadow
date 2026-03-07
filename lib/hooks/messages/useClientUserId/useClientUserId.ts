"use client";

import { useSyncExternalStore } from "react";
import { getAuthUserIdSnapshot, subscribeAuthUserId } from "./authUserIdStore";

/**
 * Retourne l'id de l'utilisateur connecté côté client (auth Supabase).
 * Utilise useSyncExternalStore pour un abonnement concurrent-safe (React 18+).
 * Secours quand le serveur n'a pas fourni currentUserId (cache, délai cookies).
 */
export function useClientUserId(): string | null {
  return useSyncExternalStore(subscribeAuthUserId, getAuthUserIdSnapshot, () => null);
}
