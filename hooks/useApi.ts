import { useCallback, useEffect, useState } from "react";

interface UseApiOptions<T> {
  immediate?: boolean;
  onCompleted?: (data: T) => void;
}

export function useApi<T>(
  fetchFn: () => Promise<T>,
  options?: UseApiOptions<T>
) {
  const [response, setResponse] = useState<T | null>(null);
  const [error, setError] = useState<any>(null);
  const [loading, setLoading] = useState(options?.immediate ?? true);
  const [status, setStatus] = useState<number | null>(null);

  const execute = useCallback(async () => {
    if (!fetchFn) {
      console.warn("useApi: fetchFn is undefined, skipping call");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await fetchFn();
      setResponse(data);
      setStatus(200); // no explicit status from data? fallback
      options?.onCompleted?.(data);
    } catch (err: any) {
      console.error("useApi error: ", err);
      setError(err);
      setStatus(err?.response?.status ?? null);
    } finally {
      setLoading(false);
    }
  }, [fetchFn, options?.onCompleted]);

  useEffect(() => {
    if (options?.immediate) {
      execute();
    }
  }, [execute, options?.immediate]);

  return { response, error, loading, status, refetch: execute };
}
