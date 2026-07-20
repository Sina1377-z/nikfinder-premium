import type { Product, ProductProvider, ProductSearchResult } from "@/lib/catalog/types";

export type ProductCatalog = {
  search(query: string, opts?: { signal?: AbortSignal }): Promise<ProductSearchResult>;
  getProductById(id: string): Product | undefined;
  getFallbackProducts(): Product[];
};

export function createProductCatalog(
  provider: ProductProvider,
  fallbackProducts: Product[],
): ProductCatalog {
  const fallbackById = new Map(fallbackProducts.map((product) => [product.id, product]));

  return {
    search: (query, opts) => provider.search(query, opts),
    getProductById: (id) => provider.getCachedProduct(id) ?? fallbackById.get(id),
    getFallbackProducts: () => fallbackProducts,
  };
}
