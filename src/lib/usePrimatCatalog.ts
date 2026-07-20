import { useEffect, useState } from "react";
import type { Product } from "@/lib/products";
import {
  MAX_CONCURRENT_PRIMAT_DISCOVERY_REQUESTS,
  PRIMAT_DISCOVERY_QUERIES,
} from "@/lib/primat-discovery";
import { searchPrimatProducts } from "@/lib/primat";

export type PrimatCatalogState = {
  products: Product[];
  loading: boolean;
  error: string | null;
};

export function usePrimatCatalog(): PrimatCatalogState {
  const [state, setState] = useState<PrimatCatalogState>({
    products: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    const controller = new AbortController();
    let cancelled = false;

    async function loadCatalog() {
      const productsById = new Map<string, Product>();
      let successfulQueries = 0;

      // Running one settled batch at a time caps requests at three while a
      // failed demo query remains isolated from every other discovery query.
      for (
        let index = 0;
        index < PRIMAT_DISCOVERY_QUERIES.length && !controller.signal.aborted;
        index += MAX_CONCURRENT_PRIMAT_DISCOVERY_REQUESTS
      ) {
        const queries = PRIMAT_DISCOVERY_QUERIES.slice(
          index,
          index + MAX_CONCURRENT_PRIMAT_DISCOVERY_REQUESTS,
        );
        const settled = await Promise.allSettled(
          queries.map((query) => searchPrimatProducts(query, { signal: controller.signal })),
        );

        settled.forEach((result) => {
          if (result.status !== "fulfilled") return;
          successfulQueries += 1;
          result.value.products.forEach((product) => {
            if (!productsById.has(product.id)) productsById.set(product.id, product);
          });
        });
      }

      if (cancelled || controller.signal.aborted) return;

      setState({
        products: Array.from(productsById.values()),
        loading: false,
        error: successfulQueries === 0 ? "Catalog discovery failed" : null,
      });
    }

    // Effects run after the initial render, so local products are never held
    // back by the optional demo-catalog discovery.
    void loadCatalog();

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, []);

  return state;
}
