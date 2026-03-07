/**
 * Rate limiting en mémoire (par identifiant client).
 * À utiliser côté serveur (Server Actions) pour limiter les tentatives login/register.
 * En production multi-instances, préférer Redis ou équivalent.
 */

type Entry = { count: number; resetAt: number };

const store = new Map<string, Entry>();

const WINDOW_MS = 15 * 60 * 1000; // 15 minutes

function now(): number {
  return Date.now();
}

function prune(): void {
  const n = now();
  for (const [key, entry] of store.entries()) {
    if (entry.resetAt <= n) store.delete(key);
  }
}

/**
 * Vérifie si l'identifiant est au-dessus de la limite.
 * Si non, incrémente le compteur et retourne false.
 * Si oui, retourne true (client rate limité).
 */
export function isRateLimited(key: string, limit: number): boolean {
  prune();
  const n = now();
  let entry = store.get(key);
  if (!entry) {
    store.set(key, { count: 1, resetAt: n + WINDOW_MS });
    return false;
  }
  if (entry.resetAt <= n) {
    entry = { count: 1, resetAt: n + WINDOW_MS };
    store.set(key, entry);
    return false;
  }
  if (entry.count >= limit) return true;
  entry.count += 1;
  return false;
}

/** Message d'erreur à afficher à l'utilisateur. */
export const RATE_LIMIT_MESSAGE = "Trop de tentatives. Réessayez dans 15 minutes.";
