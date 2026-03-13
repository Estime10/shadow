import { MESSAGES_LIST_KEY } from "@/features/messages/constants";
import type { ThreadCacheKey } from "@/lib/hooks/messages";

/** Type utilisé pour appeler mutate(key) et mutate(key, data, options). Assertion depuis useSWRConfig().mutate (ScopedMutator). */
export type InvalidateMessagesCacheMutate = (
  key: unknown,
  data?: unknown,
  options?: { revalidate?: boolean }
) => void | Promise<unknown>;

export type InvalidateMessagesCacheParams = {
  conversationId: string;
  threadCacheKey?: ThreadCacheKey;
  /** Optionnel : met à jour le cache du thread au lieu de seulement revalider (ex. suppression message). */
  threadUpdater?: (current: unknown) => unknown;
};

/**
 * Invalide le cache SWR des messages : liste des conversations + thread.
 * Une seule responsabilité, évite la duplication (DRY) dans les hooks d’envoi / édition / suppression.
 */
export function invalidateMessagesCache(
  mutate: InvalidateMessagesCacheMutate,
  params: InvalidateMessagesCacheParams
): void {
  const { conversationId, threadCacheKey, threadUpdater } = params;
  const threadKey = threadCacheKey ?? (["thread", conversationId] as ThreadCacheKey);
  void mutate(MESSAGES_LIST_KEY);
  if (threadUpdater) {
    void mutate(threadKey, threadUpdater, { revalidate: true });
  } else {
    void mutate(threadKey);
  }
}
