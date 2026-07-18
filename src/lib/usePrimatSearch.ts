import { useEffect, useState } from "react";
import { searchPrimatProducts, type PrimatSearchResult } from "@/lib/primat";

export type PrimatSearchState = {
  data: PrimatSearchResult | null;
  loading: boolean;
  error: string | null;
};

export function usePrimatSearch(query: string, debounceMs = 300): PrimatSearchState {
  const [state, setState] = useState<PrimatSearchState>({ data: null, loading: false, error: null });

  useEffect(() => {
    const q = query.trim();
    if (!q) {
      setState({ data: null, loading: false, error: null });
      return;
    }
    const ctrl = new AbortController();
    const t = setTimeout(async () => {
      setState((s) => ({ ...s, loading: true, error: null }));
      try {
        const data = await searchPrimatProducts(q, { signal: ctrl.signal });
        setState({ data, loading: false, error: null });
      } catch (err) {
        if ((err as { name?: string }).name === "AbortError") return;
        setState({ data: null, loading: false, error: (err as Error).message || "Search failed" });
      }
    }, debounceMs);
    return () => {
      ctrl.abort();
      clearTimeout(t);
    };
  }, [query, debounceMs]);

  return state;
}
