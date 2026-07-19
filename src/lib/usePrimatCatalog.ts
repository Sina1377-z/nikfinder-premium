import { useEffect, useState } from "react";
import { discoverPrimatProducts, type PrimatSearchResult } from "@/lib/primat";

export function usePrimatCatalog() {
  const [state, setState] = useState<{
    data: PrimatSearchResult | null;
    loading: boolean;
    error: string | null;
  }>({ data: null, loading: true, error: null });
  useEffect(() => {
    discoverPrimatProducts().then(
      (data) => setState({ data, loading: false, error: null }),
      (error: Error) =>
        setState({ data: null, loading: false, error: error.message || "Catalog failed" }),
    );
  }, []);
  return state;
}
