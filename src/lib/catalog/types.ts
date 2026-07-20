export type Category = "snus" | "vape-disposable" | "vape-refillable" | "cigarettes";
export type Stock = "high" | "low" | "out";

export type Store = {
  id: string;
  name: string;
  hours: string;
  isOpen: boolean;
  address?: string;
  city?: string;
  chain?: string;
  lat?: number;
  lng?: number;
  placeId?: string;
  openingHours?: string[];
};

export type Listing = {
  storeId: string;
  price: number;
  stock: Stock;
  distanceKm: number;
};

export type Product = {
  id: string;
  name: string;
  brand: string;
  category: Category;
  flavor: string;
  flavorTags: string[];
  strength: string;
  strengthMg: number;
  pouches?: number;
  puffs?: number;
  format: string;
  ingredients: string;
  description: string;
  image: string;
  listings: Listing[];
};

export type ProductSearchResult = {
  products: Product[];
  note?: string;
  count: number;
};

export type ProductProvider = {
  search(query: string, opts?: { signal?: AbortSignal }): Promise<ProductSearchResult>;
  getCachedProduct(id: string): Product | undefined;
};
