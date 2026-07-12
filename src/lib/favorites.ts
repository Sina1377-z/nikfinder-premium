import { useEffect, useState, useCallback } from "react";

const KEY = "nikfinder:favorites";
const ALERTS_KEY = "nikfinder:alerts";

function read(key: string): string[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(key) || "[]");
  } catch {
    return [];
  }
}

export function useFavorites() {
  const [ids, setIds] = useState<string[]>([]);
  useEffect(() => {
    setIds(read(KEY));
    const onStorage = () => setIds(read(KEY));
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const toggle = useCallback((id: string) => {
    setIds((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      localStorage.setItem(KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const isFav = useCallback((id: string) => ids.includes(id), [ids]);
  return { ids, toggle, isFav };
}

export function useAlerts() {
  const [ids, setIds] = useState<string[]>([]);
  useEffect(() => {
    setIds(read(ALERTS_KEY));
  }, []);

  const toggle = useCallback((id: string) => {
    setIds((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      localStorage.setItem(ALERTS_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  return { ids, toggle, has: (id: string) => ids.includes(id) };
}

const AGE_KEY = "nikfinder:age-verified";
export function useAgeGate() {
  const [verified, setVerified] = useState<boolean | null>(null);
  useEffect(() => {
    setVerified(localStorage.getItem(AGE_KEY) === "1");
  }, []);
  const confirm = useCallback(() => {
    localStorage.setItem(AGE_KEY, "1");
    setVerified(true);
  }, []);
  return { verified, confirm };
}
