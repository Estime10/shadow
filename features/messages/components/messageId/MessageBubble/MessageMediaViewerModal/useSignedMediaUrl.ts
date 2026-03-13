"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

const BUCKET = "media";
const EXPIRES_IN = 3600;

export type UseSignedMediaUrlReturn = {
  url: string | null;
  loading: boolean;
  error: string | null;
};

/**
 * Récupère une URL signée pour afficher un fichier du bucket media (privé).
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

    const supabase = createClient();
    supabase.storage
      .from(BUCKET)
      .createSignedUrl(storagePath.trim(), EXPIRES_IN)
      .then(({ data, error: err }) => {
        if (cancelled) return;
        setLoading(false);
        if (err) {
          setError(err.message);
          return;
        }
        if (data?.signedUrl) setUrl(data.signedUrl);
      });

    return () => {
      cancelled = true;
    };
  }, [storagePath, enabled]);

  return { url, loading, error };
}
