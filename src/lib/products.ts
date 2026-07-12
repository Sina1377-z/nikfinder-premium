import arcticFrost from "@/assets/product-arctic-frost.jpg";
import onyxVape from "@/assets/product-onyx-vape.jpg";
import cigarette from "@/assets/product-cigarette.jpg";
import mintPouch from "@/assets/product-mint-pouch.jpg";
import citrusPouch from "@/assets/product-citrus-pouch.jpg";
import berryVape from "@/assets/product-berry-vape.jpg";

export type Category = "snus" | "vape" | "cigarettes";
export type Stock = "high" | "low" | "out";

export type Store = {
  id: string;
  name: string;
  hours: string;
  isOpen: boolean;
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
  flavorTags: string[]; // for smart search
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

export const STORES: Record<string, Store> = {
  s1: { id: "s1", name: "QuickStop Central", hours: "Open until 23:00", isOpen: true },
  s2: { id: "s2", name: "7-Eleven Vasagatan", hours: "Open 24/7", isOpen: true },
  s3: { id: "s3", name: "Pressbyrån Metro", hours: "Closed · Opens 07:00", isOpen: false },
  s4: { id: "s4", name: "Circle K Odenplan", hours: "Open until 22:00", isOpen: true },
  s5: { id: "s5", name: "Tobaks Shop", hours: "Open until 20:00", isOpen: true },
};

export const PRODUCTS: Product[] = [
  {
    id: "arctic-frost-xl",
    name: "Arctic Frost XL",
    brand: "Velo",
    category: "snus",
    flavor: "Nordic Spice",
    flavorTags: ["mint", "peppermint", "menthol", "cool mint", "ice"],
    strength: "Extra Strong",
    strengthMg: 14,
    pouches: 24,
    format: "Slim White",
    ingredients: "Nicotine, plant fibers, humectants, flavourings, sweeteners, salt.",
    description:
      "A crisp Nordic mint pouch with a slow release and a cooling menthol finish. Slim format sits comfortably under the lip.",
    image: arcticFrost,
    listings: [
      { storeId: "s1", price: 39.0, stock: "high", distanceKm: 0.4 },
      { storeId: "s2", price: 45.0, stock: "high", distanceKm: 1.2 },
      { storeId: "s3", price: 42.0, stock: "out", distanceKm: 1.5 },
    ],
  },
  {
    id: "onyx-mist-600",
    name: "Onyx Mist Pen 600",
    brand: "Vaporex",
    category: "vape",
    flavor: "Blackcurrant Ice",
    flavorTags: ["berry", "blackcurrant", "ice", "menthol"],
    strength: "20 mg/ml",
    strengthMg: 20,
    puffs: 600,
    format: "Disposable",
    ingredients: "PG, VG, nicotine salt, natural flavourings.",
    description:
      "A refined all-black disposable with a chilled blackcurrant top note. Draw-activated with a soft airflow.",
    image: onyxVape,
    listings: [
      { storeId: "s2", price: 89.0, stock: "high", distanceKm: 1.2 },
      { storeId: "s4", price: 85.0, stock: "low", distanceKm: 2.4 },
      { storeId: "s5", price: 95.0, stock: "high", distanceKm: 3.1 },
    ],
  },
  {
    id: "xqs-cool-mint",
    name: "XQS Cool Mint Slim",
    brand: "XQS",
    category: "snus",
    flavor: "Cool Mint",
    flavorTags: ["mint", "cool mint", "peppermint", "ice mint", "menthol"],
    strength: "Strong",
    strengthMg: 10,
    pouches: 20,
    format: "Slim",
    ingredients: "Nicotine, plant fibers, water, flavourings, sweetener E950.",
    description:
      "The classic cool mint XQS — bright peppermint with a clean, dry finish. A go-to slim pouch.",
    image: mintPouch,
    listings: [
      { storeId: "s1", price: 55.0, stock: "high", distanceKm: 0.4 },
      { storeId: "s2", price: 52.5, stock: "high", distanceKm: 1.2 },
      { storeId: "s5", price: 58.0, stock: "low", distanceKm: 3.1 },
    ],
  },
  {
    id: "xqs-citrus-burst",
    name: "XQS Citrus Burst",
    brand: "XQS",
    category: "snus",
    flavor: "Citrus",
    flavorTags: ["citrus", "orange", "lemon", "fruit"],
    strength: "Regular",
    strengthMg: 6,
    pouches: 20,
    format: "Slim",
    ingredients: "Nicotine, plant fibers, water, citrus flavourings.",
    description:
      "Sweet orange and lemon with a lively tang. A softer strength XQS for a longer session.",
    image: citrusPouch,
    listings: [
      { storeId: "s3", price: 48.0, stock: "high", distanceKm: 1.5 },
      { storeId: "s4", price: 49.5, stock: "high", distanceKm: 2.4 },
    ],
  },
  {
    id: "aurora-berry-vape",
    name: "Aurora Berry Pod",
    brand: "Aurora",
    category: "vape",
    flavor: "Mixed Berry",
    flavorTags: ["berry", "raspberry", "blueberry", "fruit"],
    strength: "18 mg/ml",
    strengthMg: 18,
    puffs: 800,
    format: "Refillable pod",
    ingredients: "PG, VG, nicotine, natural berry flavourings.",
    description:
      "Layered raspberry and blueberry with a soft warmth. Pairs with the Aurora pod system.",
    image: berryVape,
    listings: [
      { storeId: "s2", price: 129.0, stock: "high", distanceKm: 1.2 },
      { storeId: "s4", price: 119.0, stock: "high", distanceKm: 2.4 },
      { storeId: "s5", price: 135.0, stock: "out", distanceKm: 3.1 },
    ],
  },
  {
    id: "north-classic-red",
    name: "North Classic Red",
    brand: "North",
    category: "cigarettes",
    flavor: "Full Tobacco",
    flavorTags: ["tobacco", "classic"],
    strength: "Full flavour",
    strengthMg: 12,
    format: "King size, 20 pcs",
    ingredients: "Tobacco, paper, filter. Contains tar and carbon monoxide.",
    description:
      "A rounded full-flavour blend in the classic red pack. Slow, even burn.",
    image: cigarette,
    listings: [
      { storeId: "s1", price: 78.0, stock: "high", distanceKm: 0.4 },
      { storeId: "s2", price: 82.0, stock: "high", distanceKm: 1.2 },
      { storeId: "s3", price: 79.5, stock: "low", distanceKm: 1.5 },
    ],
  },
];

export function lowestPrice(p: Product): number {
  return Math.min(...p.listings.filter((l) => l.stock !== "out").map((l) => l.price));
}
export function nearestKm(p: Product): number {
  return Math.min(...p.listings.map((l) => l.distanceKm));
}
export function bestStock(p: Product): Stock {
  if (p.listings.some((l) => l.stock === "high")) return "high";
  if (p.listings.some((l) => l.stock === "low")) return "low";
  return "out";
}

export function smartSearch(products: Product[], q: string): Product[] {
  const query = q.trim().toLowerCase();
  if (!query) return products;
  const tokens = query.split(/\s+/);
  return products
    .map((p) => {
      const hay = [
        p.name,
        p.brand,
        p.flavor,
        p.category,
        ...p.flavorTags,
      ]
        .join(" ")
        .toLowerCase();
      let score = 0;
      for (const t of tokens) {
        if (hay.includes(t)) score += 2;
        // fuzzy: match any flavor tag partially
        if (p.flavorTags.some((tag) => tag.includes(t) || t.includes(tag))) score += 1;
      }
      return { p, score };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((x) => x.p);
}
