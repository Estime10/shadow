"use client";

import { useState, useEffect } from "react";
import { getSignedMediaUrl } from "@/features/messages/lib/getSignedMediaUrl/getSignedMediaUrl";

export type UseSignedMediaUrlReturn = {
  url: string | null;
  loading: boolean;
  error: string | null;
};

/**
 * Hook qui expose l’URL signée d’un média (délègue à getSignedMediaUrl).
 */
export function useSignedMediaUrl(
  storagePath: string | null,
  enabled: boolean
): UseSignedMediaUrlReturn {
  const [url, setUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled || !storagePath || storagePath.trim() === "") {
      queueMicrotask(() => {
        setUrl(null);
        setLoading(false);
        setError(null);
      });
      return;
    }

    let cancelled = false;
    queueMicrotask(() => {
      setLoading(true);
      setError(null);
      setUrl(null);
    });

    getSignedMediaUrl(storagePath).then((result) => {
      if (cancelled) return;
      setLoading(false);
      if (result.success) setUrl(result.url);
      else setError(result.error);
    });

    return () => {
      cancelled = true;
    };
  }, [storagePath, enabled]);

  return { url, loading, error };
}
