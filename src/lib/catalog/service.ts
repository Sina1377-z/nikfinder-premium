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

function normalizedText(value: string): string {
  return normalizedTerms(value).join(" ");
}

function relevanceScore(product: Product, query: string, terms: string[]): number {
  const brand = normalizedText(product.brand);
  const name = normalizedText(product.name);
  const productName = normalizedText(`${product.brand} ${product.name}`);
  const productText = normalizedText(
    [
      product.brand,
      product.name,
      product.flavor,
      product.flavorTags.join(" "),
      product.format,
    ].join(" "),
  );
  const productCategoryTerms = normalizedText(categoryTerms(product));

  let score = 0;
  if (query === productName || query === name) score += 1_000;
  if (query === brand) score += 900;
  if (productText.includes(query)) score += 400;

  for (const term of terms) {
    if (term === brand) score += 120;
    if (name.includes(term)) score += 80;
    else if (productText.includes(term)) score += 30;
    if (productCategoryTerms.includes(term)) score += 5;
  }

  if (productCategoryTerms.includes(query)) score += 20;
  return score;
}

function rankSearchResults(
  products: Product[],
  query: string,
  excludeUnmatched = false,
): Product[] {
  const terms = normalizedTerms(query);
  if (!terms.length) return [];
  const normalizedQuery = terms.join(" ");

  return products
    .map((product, index) => ({
      product,
      index,
      score: relevanceScore(product, normalizedQuery, terms),
    }))
    .filter(({ score }) => !excludeUnmatched || score > 0)
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .map(({ product }) => product);
}

export function createProductCatalog(
  provider: ProductProvider,
  fallbackProducts: Product[],
): ProductCatalog {
  const fallbackById = new Map(fallbackProducts.map((product) => [product.id, product]));

  const fallbackSearch = (query: string): ProductSearchResult => {
    const products = rankSearchResults(fallbackProducts, query, true);
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
        return result.products.length
          ? { ...result, products: rankSearchResults(result.products, query) }
          : fallbackSearch(query);
      } catch (error) {
        if ((error as { name?: string }).name === "AbortError") throw error;
        return fallbackSearch(query);
      }
    },
    getProductById: (id) => provider.getCachedProduct(id) ?? fallbackById.get(id),
    getFallbackProducts: () => fallbackProducts,
  };
}
