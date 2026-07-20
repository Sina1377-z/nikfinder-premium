import { useEffect, useState } from "react";
import { searchPrimatProducts, type PrimatSearchResult } from "@/lib/primat";

const CACHE_TTL_MS = 5 * 60 * 1000;
const SESSION_CACHE_PREFIX = "nikfinder:primat-search:";

type CachedSearch = {
  expiresAt: number;
  data: PrimatSearchResult;
};

const memoryCache = new Map<string, CachedSearch>();

function cacheKey(query: string) {
  return query.trim().toLocaleLowerCase("sv-SE");
}

function readCachedSearch(key: string): PrimatSearchResult | null {
  const now = Date.now();
  const memory = memoryCache.get(key);
  if (memory?.expiresAt && memory.expiresAt > now) return memory.data;
  memoryCache.delete(key);

  try {
    const raw = sessionStorage.getItem(`${SESSION_CACHE_PREFIX}${key}`);
    if (!raw) return null;
    const cached = JSON.parse(raw) as CachedSearch;
    if (cached.expiresAt <= now) {
      sessionStorage.removeItem(`${SESSION_CACHE_PREFIX}${key}`);
      return null;
    }
    memoryCache.set(key, cached);
    return cached.data;
  } catch {
    return null;
  }
}

function cacheSearch(key: string, data: PrimatSearchResult) {
  const cached: CachedSearch = { data, expiresAt: Date.now() + CACHE_TTL_MS };
  memoryCache.set(key, cached);
  try {
    sessionStorage.setItem(`${SESSION_CACHE_PREFIX}${key}`, JSON.stringify(cached));
  } catch {
    // The in-memory cache remains available if browser storage is unavailable.
  }
}

export type PrimatSearchState = {
  data: PrimatSearchResult | null;
  loading: boolean;
  error: string | null;
};

export function usePrimatSearch(query: string, debounceMs = 300): PrimatSearchState {
  const [state, setState] = useState<PrimatSearchState>({
    data: null,
    loading: false,
    error: null,
  });

  useEffect(() => {
    const q = query.trim();
    if (!q) {
      setState({ data: null, loading: false, error: null });
      return;
    }
    const key = cacheKey(q);
    const cached = readCachedSearch(key);
    if (cached) {
      setState({ data: cached, loading: false, error: null });
      return;
    }
    const ctrl = new AbortController();
    const t = setTimeout(async () => {
      setState((s) => ({ ...s, loading: true, error: null }));
      try {
        const data = await searchPrimatProducts(q, { signal: ctrl.signal });
        cacheSearch(key, data);
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
