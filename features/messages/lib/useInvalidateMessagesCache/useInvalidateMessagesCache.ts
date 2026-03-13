"use client";

import { useCallback } from "react";
import { useSWRConfig } from "swr";
import {
  invalidateMessagesCache,
  type InvalidateMessagesCacheMutate,
  type InvalidateMessagesCacheParams,
} from "@/features/messages/lib/invalidateMessagesCache/invalidateMessagesCache";

/**
 * Retourne une fonction pour invalider le cache SWR des messages (liste + thread).
 * Centralise le cast mutate et évite la duplication dans les hooks.
 */
export function useInvalidateMessagesCache(): (params: InvalidateMessagesCacheParams) => void {
  const { mutate } = useSWRConfig();
  return useCallback(
    (params: InvalidateMessagesCacheParams) => {
      invalidateMessagesCache(mutate as InvalidateMessagesCacheMutate, params);
    },
    [mutate]
  );
}
