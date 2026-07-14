"use client";

import { useEffect, useState } from "react";

/** Load a single admin resource by id. Shared by every EditX wrapper. */
export function useResource<T>(id: string, fetcher: (id: string) => Promise<T>, errorMessage: string) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetcher(id)
      .then(setData)
      .catch((e) => setError(e instanceof Error ? e.message : errorMessage));
    // fetcher/errorMessage are stable per call site — only re-fetch when id changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return { data, error };
}
