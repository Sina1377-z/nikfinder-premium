// Primat API integration.
// Modular wrapper around the Primat demo endpoint. Swap `PRIMAT_ENDPOINT`
// for the full production endpoint later without touching the UI.

import type { Category, Product, Stock, Store } from "@/lib/products";
import { STORES } from "@/lib/products";

import pouchMintWhite from "@/assets/pouch-mint-white.jpg";
import pouchBlack from "@/assets/pouch-black.jpg";
import pouchBlue from "@/assets/pouch-blue.jpg";
import pouchRed from "@/assets/pouch-red.jpg";
import pouchOrange from "@/assets/pouch-orange.jpg";
import pouchGreen from "@/assets/pouch-green.jpg";
import pouchClassicBrown from "@/assets/pouch-classic-brown.jpg";
import cigRed from "@/assets/cig-red.jpg";
import cigBlue from "@/assets/cig-blue.jpg";
import cigBlack from "@/assets/cig-black.jpg";
import vapeBlack from "@/assets/vape-black.jpg";
import vapePurple from "@/assets/vape-purple.jpg";
import vapeMint from "@/assets/vape-mint.jpg";
import vapeRed from "@/assets/vape-red.jpg";

import { chainLabel } from "@/lib/googleMaps";

const PRIMAT_ENDPOINT = "/api/public/primat-products";

type PrimatItem = {
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
  prices?: {
    regular?: number;
    effective?: number;
    comparison?: { price?: number; unit?: string };
  };
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

// --- Nicotine filter --------------------------------------------------------
// Future-proof: match by category path segments AND product/brand keywords.
const NIC_CATEGORY_TOKENS = [
  "snus",
  "nikotin",
  "nicotine",
  "tobak",
  "tobacco",
  "cigarett",
  "cigarr",
  "cigar",
  "cigarill",
  "vape",
  "vaping",
  "e-cig",
  "ecig",
  "e-cigarett",
  "pod",
  "e-vätska",
  "e-vatska",
  "e-liquid",
  "eliquid",
  "vape juice",
  "nikotinpås",
  "nikotinpas",
  "pouches",
  "iqos",
  "heets",
  "terea",
  "heated",
  "shisha",
  "pipe",
  "pipa",
  "rolling",
  "rulltobak",
  "portionssnus",
  "loose tobacco",
  "gum",
  "tuggummi",
  "lozenge",
  "spray",
];

const NIC_BRAND_TOKENS = [
  "velo", "zyn", "loop", "lundgren", "general", "göteborgs rapé", "goteborgs rape",
  "skruf", "knox", "fix", "après", "apres", "xqs", "white fox", "ace", "volt",
  "pablo", "cuba", "dope", "helwit", "swave", "rush", "siberia", "iceberg",
  "on!", "rogue", "nordic spirit", "elf bar", "lost mary", "vuse", "iqos",
  "heets", "terea", "kelly white", "ettan", "grov", "catch", "gotlands",
  "marlboro", "camel", "l&m", "lucky strike", "pall mall", "prince", "chesterfield",
  "juul", "vaporesso", "voopoo", "smok", "geekvape",
];

function isNicotineItem(item: PrimatItem): boolean {
  const hay = `${item.category ?? ""} ${item.name ?? ""} ${item.brand ?? ""}`.toLowerCase();
  if (NIC_CATEGORY_TOKENS.some((t) => hay.includes(t))) return true;
  if (NIC_BRAND_TOKENS.some((t) => hay.includes(t))) return true;
  return false;
}

function inferCategory(raw: string | undefined, name: string): Category {
  const s = `${raw ?? ""} ${name}`.toLowerCase();
  if (s.includes("cigarett") || s.includes("cigar")) return "cigarettes";
  if (s.includes("engångs") || s.includes("engangs") || s.includes("disposable")) return "vape-disposable";
  if (s.includes("vape") || s.includes("e-cig") || s.includes("ecig") || s.includes("pod")) return "vape-refillable";
  return "snus";
}

const POUCH_IMAGES = [pouchMintWhite, pouchBlue, pouchRed, pouchOrange, pouchGreen, pouchBlack, pouchClassicBrown];
const CIG_IMAGES = [cigRed, cigBlue, cigBlack];
const VAPE_IMAGES = [vapeBlack, vapePurple, vapeMint, vapeRed];

function pickImage(cat: Category, seed: string, apiImage?: string): string {
  if (apiImage && /^https?:\/\//i.test(apiImage)) return apiImage;
  const pool =
    cat === "cigarettes" ? CIG_IMAGES : cat.startsWith("vape") ? VAPE_IMAGES : POUCH_IMAGES;
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return pool[h % pool.length];
}

function extractStrengthMg(text: string): number {
  const m = text.match(/(\d+(?:[.,]\d+)?)\s*mg/i);
  return m ? Number(m[1].replace(",", ".")) : 0;
}

function stockFrom(available: boolean | undefined): Stock {
  return available === false ? "out" : "high";
}

function ensureStore(chain: string, storeId: string): string {
  const id = `primat:${chain}:${storeId}`;
  if (!STORES[id]) {
    const label = chainLabel(chain || "primat");
    (STORES as Record<string, Store>)[id] = {
      id,
      name: `${label} · #${storeId}`,
      hours: "Opening hours unavailable",
      isOpen: true,
      chain,
    };
  }
  return id;
}

function mapItem(item: PrimatItem, idx: number): Product {
  const name = item.name ?? "Okänd produkt";
  const brand = item.brand ?? "";
  const category = inferCategory(item.category, name);
  const chain = item.chain ?? "primat";
  const storeKey = ensureStore(chain, item.store_id ?? String(idx));

  const price = item.prices?.effective ?? item.prices?.regular ?? 0;
  const stock = stockFrom(item.available);

  const strengthMg = extractStrengthMg(`${name} ${item.package ?? ""}`);
  const pkg = item.package ?? (item.amount ? `${item.amount} ${item.unit ?? ""}`.trim() : "");

  const id = `primat-${chain}-${item.store_id ?? "x"}-${item.product_id ?? idx}`;

  const product: Product = {
    id,
    name,
    brand,
    category,
    flavor: name,
    flavorTags: name.toLowerCase().split(/\s+/).filter(Boolean),
    strength: strengthMg ? `${strengthMg} mg` : pkg || "—",
    strengthMg,
    format: pkg || "—",
    ingredients: item.category ?? "",
    description:
      [item.category, pkg, item.urls?.source ? `Källa: ${new URL(item.urls.source).hostname}` : null]
        .filter(Boolean)
        .join(" · ") || `${brand} ${name}`,
    image: pickImage(category, id, item.image ?? item.image_url),
    listings: [
      {
        storeId: storeKey,
        price,
        stock,
        distanceKm: 0,
      },
    ],
  };

  productCache.set(id, product);
  return product;
}

export type PrimatSearchResult = {
  products: Product[];
  note?: string;
  count: number;
};

export async function searchPrimatProducts(
  query: string,
  opts: { signal?: AbortSignal } = {},
): Promise<PrimatSearchResult> {
  const q = query.trim();
  if (!q) return { products: [], count: 0 };

  const url = `${PRIMAT_ENDPOINT}?q=${encodeURIComponent(q)}`;
  const res = await fetch(url, { signal: opts.signal, headers: { Accept: "application/json" } });
  if (!res.ok) throw new Error(`Primat API error: ${res.status}`);
  const json: PrimatResponse = await res.json();
  const items = (json.data ?? []).filter(isNicotineItem);
  const products = items.map(mapItem);
  return { products, note: json.note, count: products.length };
}
