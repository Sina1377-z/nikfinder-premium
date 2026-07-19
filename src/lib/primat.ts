// Primat demo integration. Discovery queries are deliberately centralised so
// the demo catalog can be expanded without changing the UI.
import type { Category, Product, Stock, Store } from "@/lib/products";
import { STORES } from "@/lib/products";
import { chainLabel } from "@/lib/googleMaps";
import { getVerifiedProductImage } from "@/lib/product-images";
export { PRIMAT_DISCOVERY_QUERIES } from "@/lib/primat-discovery";

const PRIMAT_ENDPOINT = "/api/public/primat-products";

export type PrimatItem = {
  chain?: string;
  store_id?: string;
  product_id?: string;
  name?: string;
  brand?: string;
  category?: string;
  amount?: number;
  unit?: string;
  package?: string;
  available?: boolean;
  image?: string;
  image_url?: string;
  prices?: { regular?: number; effective?: number; comparison?: { price?: number; unit?: string } };
  urls?: { primat?: string; source?: string };
};

type PrimatResponse = {
  demo?: boolean;
  query?: string;
  count?: number;
  note?: string;
  data?: PrimatItem[];
};

const productCache = new Map<string, Product>();
export function getCachedPrimatProduct(id: string): Product | undefined {
  return productCache.get(id);
}
export function allCachedPrimatProducts(): Product[] {
  return Array.from(productCache.values());
}

const NICOTINE_TOKENS = [
  "snus",
  "nikotin",
  "nicotine",
  "tobak",
  "tobacco",
  "cigarett",
  "cigarr",
  "cigar",
  "vape",
  "vaping",
  "e-cig",
  "ecig",
  "pod",
  "e-vätska",
  "e-liquid",
  "iqos",
  "heets",
  "terea",
  "rulltobak",
  "nikotinpås",
  "pouches",
  "nicorette",
];
const NICOTINE_BRANDS = [
  "velo",
  "zyn",
  "loop",
  "xqs",
  "helwit",
  "kelly white",
  "skruf",
  "knox",
  "general",
  "lundgren",
  "ettan",
  "grov",
  "vont",
  "vuse",
  "elf bar",
  "lost mary",
  "rev pod",
  "nicorette",
  "marlboro",
  "camel",
  "lucky strike",
  "prince",
  "chesterfield",
];
const ACCESSORY_TOKENS = [
  "cigarettpapper",
  "cigarett papper",
  "cigaretthyls",
  "filterhyls",
  "filter",
  "tändare",
  "tobakspapper",
  "rullpapper",
  "rolling paper",
  "tubes",
  "tub",
  "askkopp",
  "grinder",
];

function normalized(value: string | undefined): string {
  return (value ?? "")
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function isNicotineItem(item: PrimatItem): boolean {
  const haystack = normalized(`${item.category ?? ""} ${item.name ?? ""} ${item.brand ?? ""}`);
  if (ACCESSORY_TOKENS.some((token) => haystack.includes(normalized(token)))) return false;
  return (
    NICOTINE_TOKENS.some((token) => haystack.includes(normalized(token))) ||
    NICOTINE_BRANDS.some((brand) => normalized(item.brand) === normalized(brand))
  );
}

function inferCategory(raw: string | undefined, name: string): Category {
  const value = normalized(`${raw ?? ""} ${name}`);
  if (value.includes("cigarett") || value.includes("cigar") || value.includes("rulltobak"))
    return "cigarettes";
  if (value.includes("engangs") || value.includes("disposable")) return "vape-disposable";
  if (
    value.includes("vape") ||
    value.includes("e cig") ||
    value.includes("ecig") ||
    value.includes("pod")
  )
    return "vape-refillable";
  return "snus";
}

function extractStrengthMg(text: string): number {
  const found = text.match(/(\d+(?:[.,]\d+)?)\s*mg(?:\s*\/\s*ml)?/i);
  return found ? Number(found[1].replace(",", ".")) : 0;
}

function stockFrom(available: boolean | undefined): Stock {
  return available === false ? "out" : "high";
}

function ensureStore(chain: string, storeId: string): string {
  const id = `primat:${chain}:${storeId}`;
  if (!STORES[id]) {
    (STORES as Record<string, Store>)[id] = {
      id,
      name: `${chainLabel(chain || "primat")} · #${storeId}`,
      hours: "Opening hours unavailable",
      isOpen: true,
      chain,
    };
  }
  return id;
}

// A product_id is merged only with the same normalized brand, name and package.
// This preserves distinct products even if a retailer reuses an internal id.
function mergeKey(item: PrimatItem, index: number): string {
  const productId = item.product_id?.trim();
  const fingerprint = [
    normalized(item.brand),
    normalized(item.name),
    normalized(item.package ?? `${item.amount ?? ""} ${item.unit ?? ""}`),
  ].join("|");
  return productId
    ? `${productId}|${fingerprint}`
    : `${item.chain ?? "unknown"}|${item.store_id ?? index}|${fingerprint}`;
}

function mapGroup(items: PrimatItem[], index: number): Product {
  const item = items[0];
  const name = item.name ?? "Okänd produkt";
  const brand = item.brand ?? "";
  const packageText =
    item.package ?? (item.amount ? `${item.amount} ${item.unit ?? ""}`.trim() : "");
  const category = inferCategory(item.category, name);
  const id = `primat-${mergeKey(item, index)}`;
  const listings = items.map((entry, listingIndex) => ({
    storeId: ensureStore(entry.chain ?? "primat", entry.store_id ?? String(listingIndex)),
    price: entry.prices?.effective ?? entry.prices?.regular ?? 0,
    stock: stockFrom(entry.available),
    distanceKm: 0,
  }));
  const uniqueListings = listings.filter(
    (listing, listingIndex, all) =>
      all.findIndex((other) => other.storeId === listing.storeId) === listingIndex,
  );
  const strengthMg = extractStrengthMg(`${name} ${packageText}`);
  const source = item.urls?.source;
  const sourceHost = source ? new URL(source).hostname : null;
  const product: Product = {
    id,
    name,
    brand,
    category,
    flavor: name,
    flavorTags: normalized(name).split(" ").filter(Boolean),
    strength: strengthMg ? `${strengthMg} mg` : packageText || "—",
    strengthMg,
    format: packageText || "—",
    ingredients: item.category ?? "",
    description:
      [item.category, packageText, sourceHost ? `Källa: ${sourceHost}` : null]
        .filter(Boolean)
        .join(" · ") || `${brand} ${name}`,
    image: getVerifiedProductImage(item.product_id),
    listings: uniqueListings,
  };
  productCache.set(id, product);
  return product;
}

export function mergePrimatItems(items: PrimatItem[]): Product[] {
  const groups = new Map<string, PrimatItem[]>();
  items.filter(isNicotineItem).forEach((item, index) => {
    const key = mergeKey(item, index);
    groups.set(key, [...(groups.get(key) ?? []), item]);
  });
  return Array.from(groups.values()).map(mapGroup);
}

export type PrimatSearchResult = { products: Product[]; note?: string; count: number };

async function requestPrimat(
  params: URLSearchParams,
  signal?: AbortSignal,
): Promise<PrimatSearchResult> {
  const res = await fetch(`${PRIMAT_ENDPOINT}?${params}`, {
    signal,
    headers: { Accept: "application/json" },
  });
  if (!res.ok) throw new Error(`Primat API error: ${res.status}`);
  const json: PrimatResponse = await res.json();
  const products = mergePrimatItems(json.data ?? []);
  return { products, note: json.note, count: products.length };
}

export async function searchPrimatProducts(
  query: string,
  opts: { signal?: AbortSignal } = {},
): Promise<PrimatSearchResult> {
  const q = query.trim();
  return q ? requestPrimat(new URLSearchParams({ q }), opts.signal) : { products: [], count: 0 };
}

let catalogPromise: Promise<PrimatSearchResult> | null = null;
export function discoverPrimatProducts(): Promise<PrimatSearchResult> {
  catalogPromise ??= requestPrimat(new URLSearchParams({ catalog: "1" }));
  return catalogPromise;
}
