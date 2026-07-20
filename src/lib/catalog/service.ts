import type { Product, ProductProvider, ProductSearchResult } from "@/lib/catalog/types";

export type ProductCatalog = {
  search(query: string, opts?: { signal?: AbortSignal }): Promise<ProductSearchResult>;
  getProductById(id: string): Product | undefined;
  getFallbackProducts(): Product[];
};

function normalizedTerms(query: string): string[] {
  return query
    .toLocaleLowerCase("sv-SE")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .split(/[^a-z0-9]+/)
    .filter(Boolean);
}

function categoryTerms(product: Product): string {
  if (product.category === "snus") return "snus nicotine pouch pouches nikotinpasar";
  if (product.category.startsWith("vape")) return "vape e cigarette e cigg ecig";
  return "cigarette cigarettes cigaretter cigg";
}

function searchFallbackProducts(products: Product[], query: string): Product[] {
  const terms = normalizedTerms(query);
  if (!terms.length) return [];

  return products
    .map((product) => {
      const haystack = normalizedTerms(
        [
          product.brand,
          product.name,
          product.flavor,
          product.flavorTags.join(" "),
          product.format,
          categoryTerms(product),
        ].join(" "),
      ).join(" ");
      const score = terms.reduce((total, term) => total + (haystack.includes(term) ? 1 : 0), 0);
      return { product, score };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score || a.product.name.localeCompare(b.product.name, "sv-SE"))
    .map(({ product }) => product);
}

export function createProductCatalog(
  provider: ProductProvider,
  fallbackProducts: Product[],
): ProductCatalog {
  const fallbackById = new Map(fallbackProducts.map((product) => [product.id, product]));

  const fallbackSearch = (query: string): ProductSearchResult => {
    const products = searchFallbackProducts(fallbackProducts, query);
    return {
      products,
      count: products.length,
      note: products.length ? "Showing demo catalog results." : undefined,
    };
  };

  return {
    search: async (query, opts) => {
      try {
        const result = await provider.search(query, opts);
        return result.products.length ? result : fallbackSearch(query);
      } catch (error) {
        if ((error as { name?: string }).name === "AbortError") throw error;
        return fallbackSearch(query);
      }
    },
    getProductById: (id) => provider.getCachedProduct(id) ?? fallbackById.get(id),
    getFallbackProducts: () => fallbackProducts,
  };
}
