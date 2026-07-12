// NOTE: Product images are AI-generated, retail-style placeholder photos on
// a clean white background. In production, replace `image` URLs with
// officially licensed product photography while keeping all other fields.

import pouchMintWhite from "@/assets/pouch-mint-white.jpg";
import pouchBlack from "@/assets/pouch-black.jpg";
import pouchBlue from "@/assets/pouch-blue.jpg";
import pouchRed from "@/assets/pouch-red.jpg";
import pouchOrange from "@/assets/pouch-orange.jpg";
import pouchGreen from "@/assets/pouch-green.jpg";
import pouchPurple from "@/assets/pouch-purple.jpg";
import pouchClassicBrown from "@/assets/pouch-classic-brown.jpg";
import cigRed from "@/assets/cig-red.jpg";
import cigBlue from "@/assets/cig-blue.jpg";
import cigBlack from "@/assets/cig-black.jpg";
import vapeBlack from "@/assets/vape-black.jpg";
import vapePurple from "@/assets/vape-purple.jpg";
import vapeMint from "@/assets/vape-mint.jpg";
import vapeRed from "@/assets/vape-red.jpg";
import vapePodSilver from "@/assets/vape-pod-silver.jpg";

export type Category = "snus" | "vape-disposable" | "vape-refillable" | "cigarettes";
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

export const STORES: Record<string, Store> = {
  s1: { id: "s1", name: "QuickStop Central", hours: "Open until 23:00", isOpen: true },
  s2: { id: "s2", name: "7-Eleven Vasagatan", hours: "Open 24/7", isOpen: true },
  s3: { id: "s3", name: "Pressbyrån Metro", hours: "Closed · Opens 07:00", isOpen: false },
  s4: { id: "s4", name: "Circle K Odenplan", hours: "Open until 22:00", isOpen: true },
  s5: { id: "s5", name: "Tobaks Shop", hours: "Open until 20:00", isOpen: true },
  s6: { id: "s6", name: "ICA Nära Kungsholmen", hours: "Open until 22:00", isOpen: true },
  s7: { id: "s7", name: "Coop Sveavägen", hours: "Open until 21:00", isOpen: true },
};

// Ingredients templates
const POUCH_ING =
  "Nicotine, plant fibers (E460), water, humectants (E1520, E422), flavourings, sweeteners (E950, E955), acidity regulators (E500, E524), salt.";
const LOOSE_ING =
  "Tobacco, water, salt, humectants (E1520, E422), flavourings, acidity regulator (E500).";
const CIG_ING =
  "Tobacco, paper, acetate filter. Smoke contains tar, nicotine and carbon monoxide.";
const VAPE_ING =
  "Propylene glycol (PG), vegetable glycerin (VG), nicotine salt, natural and artificial flavourings.";

let idc = 0;
const uid = (brand: string, name: string) =>
  `${brand}-${name}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "") + `-${++idc}`;

// Random-ish but deterministic listings generator
function listings(base: number, ...variants: Array<[keyof typeof STORES, number, Stock, number]>): Listing[] {
  return variants.map(([storeId, delta, stock, km]) => ({
    storeId,
    price: +(base + delta).toFixed(2),
    stock,
    distanceKm: km,
  }));
}

type P = Omit<Product, "id">;

const catalog: P[] = [
  // ============ VELO ============
  {
    name: "Ice Cool Mint Slim",
    brand: "VELO",
    category: "snus",
    flavor: "Ice Cool Mint",
    flavorTags: ["mint", "cool mint", "ice", "menthol", "peppermint"],
    strength: "Strong",
    strengthMg: 10,
    pouches: 24,
    format: "Slim White Dry",
    ingredients: POUCH_ING,
    description:
      "Bright peppermint with an icy menthol finish and a slow, controlled nicotine release. Slim, dry pouch that stays comfortable for hours.",
    image: pouchMintWhite,
    listings: listings(52, ["s1", -3, "high", 0.4], ["s2", 0, "high", 1.2], ["s3", 1, "out", 1.5]),
  },
  {
    name: "Freeze X-Strong",
    brand: "VELO",
    category: "snus",
    flavor: "Arctic Mint",
    flavorTags: ["mint", "menthol", "ice", "freeze"],
    strength: "Extra Strong",
    strengthMg: 14,
    pouches: 24,
    format: "Slim White Dry",
    ingredients: POUCH_ING,
    description: "The most intense VELO — deep-frozen mint hit and long lasting cooling sensation.",
    image: pouchBlue,
    listings: listings(59, ["s1", -1, "high", 0.4], ["s4", 2, "low", 2.4], ["s5", 4, "high", 3.1]),
  },
  {
    name: "Ruby Berry",
    brand: "VELO",
    category: "snus",
    flavor: "Mixed Berry",
    flavorTags: ["berry", "raspberry", "strawberry", "fruit"],
    strength: "Strong",
    strengthMg: 10,
    pouches: 24,
    format: "Slim White Dry",
    ingredients: POUCH_ING,
    description: "Layered raspberry and strawberry with a light sweetness and a smooth release.",
    image: pouchRed,
    listings: listings(52, ["s2", 0, "high", 1.2], ["s6", -2, "high", 1.8], ["s7", 3, "low", 2.7]),
  },
  {
    name: "Tropic Breeze",
    brand: "VELO",
    category: "snus",
    flavor: "Tropical Fruit",
    flavorTags: ["tropical", "mango", "pineapple", "fruit"],
    strength: "Regular",
    strengthMg: 6,
    pouches: 24,
    format: "Slim White Dry",
    ingredients: POUCH_ING,
    description: "Sun-warm mango and pineapple over a light coconut note. Softer strength for longer sessions.",
    image: pouchOrange,
    listings: listings(49, ["s3", -1, "high", 1.5], ["s4", 1, "high", 2.4]),
  },

  // ============ ZYN ============
  {
    name: "Cool Mint",
    brand: "ZYN",
    category: "snus",
    flavor: "Cool Mint",
    flavorTags: ["mint", "cool mint", "menthol", "peppermint"],
    strength: "Regular",
    strengthMg: 6,
    pouches: 21,
    format: "Slim Mini Dry",
    ingredients: POUCH_ING,
    description: "The iconic ZYN cool mint — crisp peppermint with a clean dry finish.",
    image: pouchMintWhite,
    listings: listings(45, ["s1", -1, "high", 0.4], ["s2", 1, "high", 1.2], ["s5", 3, "low", 3.1]),
  },
  {
    name: "Cool Mint Strong",
    brand: "ZYN",
    category: "snus",
    flavor: "Cool Mint",
    flavorTags: ["mint", "cool mint", "menthol", "peppermint"],
    strength: "Strong",
    strengthMg: 9.6,
    pouches: 21,
    format: "Slim Mini Dry",
    ingredients: POUCH_ING,
    description: "The same crisp cool mint at a stronger nicotine level.",
    image: pouchBlue,
    listings: listings(49, ["s1", 0, "high", 0.4], ["s2", 0, "high", 1.2], ["s6", -2, "high", 1.8]),
  },
  {
    name: "Citrus",
    brand: "ZYN",
    category: "snus",
    flavor: "Citrus",
    flavorTags: ["citrus", "orange", "lemon", "fruit"],
    strength: "Regular",
    strengthMg: 6,
    pouches: 21,
    format: "Slim Mini Dry",
    ingredients: POUCH_ING,
    description: "Sweet orange and lemon zest with a lively finish.",
    image: pouchOrange,
    listings: listings(45, ["s3", 0, "high", 1.5], ["s4", 2, "high", 2.4], ["s7", -1, "high", 2.7]),
  },
  {
    name: "Espressino Strong",
    brand: "ZYN",
    category: "snus",
    flavor: "Espresso",
    flavorTags: ["coffee", "espresso", "cocoa"],
    strength: "Strong",
    strengthMg: 9.6,
    pouches: 21,
    format: "Slim Mini Dry",
    ingredients: POUCH_ING,
    description: "Dark espresso and cocoa with a hint of caramel sweetness.",
    image: pouchBlack,
    listings: listings(49, ["s2", -1, "high", 1.2], ["s5", 2, "low", 3.1]),
  },

  // ============ XQS ============
  {
    name: "Cool Mint Slim",
    brand: "XQS",
    category: "snus",
    flavor: "Cool Mint",
    flavorTags: ["mint", "cool mint", "ice mint", "menthol", "peppermint"],
    strength: "Strong",
    strengthMg: 10,
    pouches: 20,
    format: "Slim",
    ingredients: POUCH_ING,
    description: "The classic cool mint XQS — bright peppermint with a clean, dry finish.",
    image: pouchMintWhite,
    listings: listings(55, ["s1", 0, "high", 0.4], ["s2", -2.5, "high", 1.2], ["s5", 3, "low", 3.1]),
  },
  {
    name: "Citrus Burst",
    brand: "XQS",
    category: "snus",
    flavor: "Citrus",
    flavorTags: ["citrus", "orange", "lemon", "fruit"],
    strength: "Regular",
    strengthMg: 6,
    pouches: 20,
    format: "Slim",
    ingredients: POUCH_ING,
    description: "Sweet orange and lemon with a lively tang.",
    image: pouchOrange,
    listings: listings(48, ["s3", 0, "high", 1.5], ["s4", 1.5, "high", 2.4]),
  },
  {
    name: "Blueberry",
    brand: "XQS",
    category: "snus",
    flavor: "Blueberry",
    flavorTags: ["blueberry", "berry", "fruit"],
    strength: "Strong",
    strengthMg: 10,
    pouches: 20,
    format: "Slim",
    ingredients: POUCH_ING,
    description: "Ripe blueberry with a hint of vanilla on the finish.",
    image: pouchPurple,
    listings: listings(55, ["s2", -1, "high", 1.2], ["s6", 1, "high", 1.8]),
  },

  // ============ Loop ============
  {
    name: "Jalapeño Lime",
    brand: "Loop",
    category: "snus",
    flavor: "Jalapeño Lime",
    flavorTags: ["lime", "jalapeño", "spicy", "citrus"],
    strength: "Extra Strong",
    strengthMg: 12.5,
    pouches: 20,
    format: "Slim",
    ingredients: POUCH_ING,
    description: "Bright lime cut by a peppery jalapeño heat. Not for the faint-hearted.",
    image: pouchGreen,
    listings: listings(59, ["s1", 0, "high", 0.4], ["s2", 2, "low", 1.2]),
  },
  {
    name: "Fizzy Cola",
    brand: "Loop",
    category: "snus",
    flavor: "Cola",
    flavorTags: ["cola", "sweet", "fizzy"],
    strength: "Strong",
    strengthMg: 9.5,
    pouches: 20,
    format: "Slim",
    ingredients: POUCH_ING,
    description: "Sparkling cola with a caramel finish — nostalgia in a can.",
    image: pouchRed,
    listings: listings(55, ["s4", 0, "high", 2.4], ["s5", 3, "high", 3.1]),
  },
  {
    name: "Absolute Zero",
    brand: "Loop",
    category: "snus",
    flavor: "Menthol",
    flavorTags: ["menthol", "mint", "ice", "freeze"],
    strength: "Extra Strong",
    strengthMg: 12.5,
    pouches: 20,
    format: "Slim",
    ingredients: POUCH_ING,
    description: "Sub-zero menthol with a long lasting cooling burn.",
    image: pouchBlue,
    listings: listings(59, ["s1", -1, "high", 0.4], ["s6", 2, "high", 1.8]),
  },

  // ============ Lundgrens ============
  {
    name: "Skärgårdstobak Portion",
    brand: "Lundgrens",
    category: "snus",
    flavor: "Bergamot & Rose",
    flavorTags: ["bergamot", "floral", "tobacco", "classic"],
    strength: "Regular",
    strengthMg: 8,
    pouches: 24,
    format: "Original Portion",
    ingredients: LOOSE_ING,
    description: "A classic Swedish portion with bergamot and a delicate floral note over rounded tobacco.",
    image: pouchClassicBrown,
    listings: listings(45, ["s2", 0, "high", 1.2], ["s7", -1, "high", 2.7]),
  },
  {
    name: "Norrland White Dry",
    brand: "Lundgrens",
    category: "snus",
    flavor: "Juniper & Tobacco",
    flavorTags: ["juniper", "tobacco", "spice"],
    strength: "Strong",
    strengthMg: 12,
    pouches: 24,
    format: "White Dry Portion",
    ingredients: LOOSE_ING,
    description: "Cold-smoked tobacco with juniper and a hint of cedar. Long, dry release.",
    image: pouchClassicBrown,
    listings: listings(49, ["s1", 0, "high", 0.4], ["s5", 3, "low", 3.1]),
  },

  // ============ White Fox ============
  {
    name: "Full Charge",
    brand: "White Fox",
    category: "snus",
    flavor: "Mint & Eucalyptus",
    flavorTags: ["mint", "eucalyptus", "menthol", "spearmint"],
    strength: "Extra Strong",
    strengthMg: 16,
    pouches: 20,
    format: "Slim White Dry",
    ingredients: POUCH_ING,
    description: "Full-throttle spearmint and eucalyptus. Sharp, long lasting nicotine kick.",
    image: pouchBlack,
    listings: listings(62, ["s1", 0, "high", 0.4], ["s2", 2, "high", 1.2], ["s5", 4, "low", 3.1]),
  },
  {
    name: "Black Edition",
    brand: "White Fox",
    category: "snus",
    flavor: "Peppermint",
    flavorTags: ["mint", "peppermint", "menthol"],
    strength: "Extra Strong",
    strengthMg: 16,
    pouches: 20,
    format: "Slim White Dry",
    ingredients: POUCH_ING,
    description: "Peppermint driven with a heavier hit than the Original. Signature dry pouch.",
    image: pouchBlack,
    listings: listings(62, ["s4", 0, "high", 2.4], ["s6", -1, "high", 1.8]),
  },
  {
    name: "Double Mint",
    brand: "White Fox",
    category: "snus",
    flavor: "Double Mint",
    flavorTags: ["mint", "spearmint", "peppermint", "menthol"],
    strength: "Strong",
    strengthMg: 12,
    pouches: 20,
    format: "Slim White Dry",
    ingredients: POUCH_ING,
    description: "Twin peppermint and spearmint layered for a fresh double hit.",
    image: pouchMintWhite,
    listings: listings(58, ["s1", -1, "high", 0.4], ["s2", 1, "high", 1.2]),
  },

  // ============ Après ============
  {
    name: "Cool Mint",
    brand: "Après",
    category: "snus",
    flavor: "Cool Mint",
    flavorTags: ["mint", "cool mint", "menthol"],
    strength: "Strong",
    strengthMg: 10,
    pouches: 20,
    format: "Slim All-White",
    ingredients: POUCH_ING,
    description: "Après signature cool mint — smooth, cold and understated.",
    image: pouchMintWhite,
    listings: listings(55, ["s2", 0, "high", 1.2], ["s6", -1, "high", 1.8]),
  },
  {
    name: "Salted Caramel",
    brand: "Après",
    category: "snus",
    flavor: "Salted Caramel",
    flavorTags: ["caramel", "sweet", "vanilla"],
    strength: "Strong",
    strengthMg: 10,
    pouches: 20,
    format: "Slim All-White",
    ingredients: POUCH_ING,
    description: "Buttery caramel with a light salt finish and a warm vanilla base.",
    image: pouchOrange,
    listings: listings(55, ["s3", 0, "high", 1.5], ["s4", 1, "low", 2.4]),
  },

  // ============ FIX ============
  {
    name: "White Mint",
    brand: "FIX",
    category: "snus",
    flavor: "Mint",
    flavorTags: ["mint", "spearmint", "menthol"],
    strength: "Strong",
    strengthMg: 8,
    pouches: 20,
    format: "Mini Portion",
    ingredients: POUCH_ING,
    description: "A discreet mini with a soft spearmint profile — easy under the lip.",
    image: pouchMintWhite,
    listings: listings(42, ["s1", 0, "high", 0.4], ["s7", -1, "high", 2.7]),
  },
  {
    name: "Cranberry",
    brand: "FIX",
    category: "snus",
    flavor: "Cranberry",
    flavorTags: ["cranberry", "berry", "fruit"],
    strength: "Regular",
    strengthMg: 6,
    pouches: 20,
    format: "Mini Portion",
    ingredients: POUCH_ING,
    description: "Tart cranberry with a hint of sweetness. Compact mini format.",
    image: pouchRed,
    listings: listings(39, ["s2", 0, "high", 1.2], ["s6", 1, "high", 1.8]),
  },

  // ============ Helwit ============
  {
    name: "Mint",
    brand: "Helwit",
    category: "snus",
    flavor: "Peppermint",
    flavorTags: ["mint", "peppermint", "menthol"],
    strength: "Strong",
    strengthMg: 14,
    pouches: 24,
    format: "Slim All-White",
    ingredients: POUCH_ING,
    description: "Peppermint driven Swedish all-white with a strong steady release.",
    image: pouchGreen,
    listings: listings(48, ["s1", -1, "high", 0.4], ["s5", 2, "high", 3.1]),
  },
  {
    name: "Blueberry",
    brand: "Helwit",
    category: "snus",
    flavor: "Blueberry",
    flavorTags: ["blueberry", "berry", "fruit"],
    strength: "Strong",
    strengthMg: 14,
    pouches: 24,
    format: "Slim All-White",
    ingredients: POUCH_ING,
    description: "Sweet blueberry with a rounded, jam-like body.",
    image: pouchPurple,
    listings: listings(48, ["s2", 0, "high", 1.2], ["s7", -1, "high", 2.7]),
  },
  {
    name: "Coffee",
    brand: "Helwit",
    category: "snus",
    flavor: "Coffee",
    flavorTags: ["coffee", "espresso", "cocoa"],
    strength: "Strong",
    strengthMg: 14,
    pouches: 24,
    format: "Slim All-White",
    ingredients: POUCH_ING,
    description: "Roasted coffee bean with a soft cocoa aftertaste.",
    image: pouchBlack,
    listings: listings(48, ["s3", 0, "high", 1.5], ["s4", 1, "low", 2.4]),
  },

  // ============ Kelly White ============
  {
    name: "Mango",
    brand: "Kelly White",
    category: "snus",
    flavor: "Mango",
    flavorTags: ["mango", "tropical", "fruit"],
    strength: "Strong",
    strengthMg: 10,
    pouches: 20,
    format: "Slim All-White",
    ingredients: POUCH_ING,
    description: "Ripe mango with a soft peach undertone.",
    image: pouchOrange,
    listings: listings(52, ["s1", 0, "high", 0.4], ["s2", 1, "high", 1.2]),
  },
  {
    name: "Watermelon",
    brand: "Kelly White",
    category: "snus",
    flavor: "Watermelon",
    flavorTags: ["watermelon", "fruit", "sweet"],
    strength: "Strong",
    strengthMg: 10,
    pouches: 20,
    format: "Slim All-White",
    ingredients: POUCH_ING,
    description: "Fresh watermelon with a light cooling finish.",
    image: pouchRed,
    listings: listings(52, ["s6", 0, "high", 1.8], ["s7", 1, "low", 2.7]),
  },

  // ============ Skruf ============
  {
    name: "Super White Fresh",
    brand: "Skruf",
    category: "snus",
    flavor: "Peppermint & Eucalyptus",
    flavorTags: ["mint", "peppermint", "eucalyptus", "menthol"],
    strength: "Strong",
    strengthMg: 11,
    pouches: 20,
    format: "Slim Super White",
    ingredients: POUCH_ING,
    description: "Cold peppermint with a green eucalyptus lift. Dry, long lasting slim pouch.",
    image: pouchGreen,
    listings: listings(52, ["s1", -1, "high", 0.4], ["s2", 0, "high", 1.2]),
  },
  {
    name: "Original Portion",
    brand: "Skruf",
    category: "snus",
    flavor: "Bergamot & Tobacco",
    flavorTags: ["bergamot", "tobacco", "classic"],
    strength: "Regular",
    strengthMg: 8,
    pouches: 24,
    format: "Original Portion",
    ingredients: LOOSE_ING,
    description: "Rounded tobacco with bergamot and a subtle floral finish. A Swedish classic.",
    image: pouchClassicBrown,
    listings: listings(44, ["s3", 0, "high", 1.5], ["s7", -1, "high", 2.7]),
  },

  // ============ Göteborgs Rapé ============
  {
    name: "Original Portion",
    brand: "Göteborgs Rapé",
    category: "snus",
    flavor: "Juniper & Lavender",
    flavorTags: ["juniper", "lavender", "tobacco", "herbal", "classic"],
    strength: "Regular",
    strengthMg: 8,
    pouches: 24,
    format: "Original Portion",
    ingredients: LOOSE_ING,
    description: "The Gothenburg classic — juniper, lavender and a soft citrus over dry tobacco.",
    image: pouchClassicBrown,
    listings: listings(46, ["s1", 0, "high", 0.4], ["s2", 1, "high", 1.2], ["s7", -1, "high", 2.7]),
  },
  {
    name: "Lössnus",
    brand: "Göteborgs Rapé",
    category: "snus",
    flavor: "Juniper & Lavender",
    flavorTags: ["juniper", "lavender", "tobacco", "loose", "classic"],
    strength: "Regular",
    strengthMg: 8,
    format: "Loose (42 g)",
    ingredients: LOOSE_ING,
    description: "Loose Göteborgs Rapé for the traditional bake-your-own experience.",
    image: pouchClassicBrown,
    listings: listings(52, ["s5", 0, "high", 3.1], ["s6", 1, "low", 1.8]),
  },

  // ============ Ettan ============
  {
    name: "Original Portion",
    brand: "Ettan",
    category: "snus",
    flavor: "Rich Tobacco",
    flavorTags: ["tobacco", "classic", "earthy"],
    strength: "Regular",
    strengthMg: 8,
    pouches: 24,
    format: "Original Portion",
    ingredients: LOOSE_ING,
    description: "Sweden's oldest snus — full, earthy tobacco with a hint of dried leather.",
    image: pouchClassicBrown,
    listings: listings(46, ["s2", 0, "high", 1.2], ["s7", -1, "high", 2.7]),
  },
  {
    name: "Lössnus",
    brand: "Ettan",
    category: "snus",
    flavor: "Rich Tobacco",
    flavorTags: ["tobacco", "classic", "loose"],
    strength: "Regular",
    strengthMg: 8,
    format: "Loose (42 g)",
    ingredients: LOOSE_ING,
    description: "The original 1822 recipe as a loose snus.",
    image: pouchClassicBrown,
    listings: listings(52, ["s1", 0, "high", 0.4], ["s5", 2, "high", 3.1]),
  },

  // ============ General ============
  {
    name: "White Portion",
    brand: "General",
    category: "snus",
    flavor: "Bergamot & Tobacco",
    flavorTags: ["bergamot", "tobacco", "classic"],
    strength: "Regular",
    strengthMg: 8,
    pouches: 24,
    format: "White Portion",
    ingredients: LOOSE_ING,
    description: "Slow release white portion — bergamot with a rounded tobacco body.",
    image: pouchClassicBrown,
    listings: listings(45, ["s1", 0, "high", 0.4], ["s2", 1, "high", 1.2]),
  },
  {
    name: "Strong Portion",
    brand: "General",
    category: "snus",
    flavor: "Bergamot & Tobacco",
    flavorTags: ["bergamot", "tobacco", "strong"],
    strength: "Strong",
    strengthMg: 12,
    pouches: 24,
    format: "Original Portion",
    ingredients: LOOSE_ING,
    description: "Classic General flavour with a stronger nicotine hit.",
    image: pouchClassicBrown,
    listings: listings(48, ["s3", 0, "high", 1.5], ["s6", 1, "high", 1.8]),
  },

  // ============ CIGARETTES ============
  {
    name: "Classic Red",
    brand: "Marlboro",
    category: "cigarettes",
    flavor: "Full Tobacco",
    flavorTags: ["tobacco", "classic", "full"],
    strength: "Full flavour",
    strengthMg: 10,
    format: "King size, 20 pcs",
    ingredients: CIG_ING,
    description: "A rounded full-flavour blend in the classic red pack.",
    image: cigRed,
    listings: listings(85, ["s1", 0, "high", 0.4], ["s2", 2, "high", 1.2], ["s3", -0.5, "low", 1.5]),
  },
  {
    name: "Gold",
    brand: "Marlboro",
    category: "cigarettes",
    flavor: "Light Tobacco",
    flavorTags: ["tobacco", "light", "smooth"],
    strength: "Smooth",
    strengthMg: 6,
    format: "King size, 20 pcs",
    ingredients: CIG_ING,
    description: "A smoother, lighter Marlboro blend.",
    image: cigBlue,
    listings: listings(85, ["s2", 0, "high", 1.2], ["s4", 1, "high", 2.4]),
  },
  {
    name: "Blue",
    brand: "Camel",
    category: "cigarettes",
    flavor: "Light Tobacco",
    flavorTags: ["tobacco", "light", "smooth"],
    strength: "Smooth",
    strengthMg: 6,
    format: "King size, 20 pcs",
    ingredients: CIG_ING,
    description: "Camel's smoother blue blend with a light Virginia body.",
    image: cigBlue,
    listings: listings(82, ["s1", 0, "high", 0.4], ["s5", 3, "high", 3.1]),
  },
  {
    name: "Silver",
    brand: "L&M",
    category: "cigarettes",
    flavor: "Light Tobacco",
    flavorTags: ["tobacco", "light", "smooth"],
    strength: "Smooth",
    strengthMg: 5,
    format: "King size, 20 pcs",
    ingredients: CIG_ING,
    description: "A budget-friendly smooth blend with a clean, light finish.",
    image: cigBlue,
    listings: listings(72, ["s3", 0, "high", 1.5], ["s6", 1, "high", 1.8], ["s7", -0.5, "high", 2.7]),
  },
  {
    name: "Red",
    brand: "Prince",
    category: "cigarettes",
    flavor: "Full Tobacco",
    flavorTags: ["tobacco", "classic", "full"],
    strength: "Full flavour",
    strengthMg: 10,
    format: "King size, 20 pcs",
    ingredients: CIG_ING,
    description: "A Scandinavian classic — rich, full-bodied tobacco.",
    image: cigRed,
    listings: listings(84, ["s2", 0, "high", 1.2], ["s5", 2, "high", 3.1]),
  },
  {
    name: "Black Edition",
    brand: "Lucky Strike",
    category: "cigarettes",
    flavor: "Dark Tobacco",
    flavorTags: ["tobacco", "dark", "full"],
    strength: "Full flavour",
    strengthMg: 10,
    format: "King size, 20 pcs",
    ingredients: CIG_ING,
    description: "A darker, more intense Lucky Strike blend in a matte black pack.",
    image: cigBlack,
    listings: listings(88, ["s1", 0, "high", 0.4], ["s4", 2, "low", 2.4]),
  },

  // ============ DISPOSABLE VAPES ============
  {
    name: "Bar 600 Blueberry Ice",
    brand: "Elf Bar",
    category: "vape-disposable",
    flavor: "Blueberry Ice",
    flavorTags: ["blueberry", "berry", "ice", "menthol"],
    strength: "20 mg/ml",
    strengthMg: 20,
    puffs: 600,
    format: "Disposable",
    ingredients: VAPE_ING,
    description: "Ripe blueberry over a cool menthol base — the classic Elf Bar profile.",
    image: vapePurple,
    listings: listings(79, ["s1", 0, "high", 0.4], ["s2", 2, "high", 1.2], ["s4", -1, "low", 2.4]),
  },
  {
    name: "Bar 600 Watermelon",
    brand: "Elf Bar",
    category: "vape-disposable",
    flavor: "Watermelon",
    flavorTags: ["watermelon", "fruit", "sweet"],
    strength: "20 mg/ml",
    strengthMg: 20,
    puffs: 600,
    format: "Disposable",
    ingredients: VAPE_ING,
    description: "Sweet fresh watermelon with a clean finish.",
    image: vapeRed,
    listings: listings(79, ["s2", 0, "high", 1.2], ["s6", -1, "high", 1.8]),
  },
  {
    name: "Bar 600 Cool Mint",
    brand: "Elf Bar",
    category: "vape-disposable",
    flavor: "Cool Mint",
    flavorTags: ["mint", "menthol", "cool mint"],
    strength: "20 mg/ml",
    strengthMg: 20,
    puffs: 600,
    format: "Disposable",
    ingredients: VAPE_ING,
    description: "Bright peppermint with a chilled menthol finish.",
    image: vapeMint,
    listings: listings(79, ["s1", 0, "high", 0.4], ["s5", 3, "high", 3.1]),
  },
  {
    name: "Crystal Bar Mr Blue",
    brand: "SKE",
    category: "vape-disposable",
    flavor: "Blue Raspberry",
    flavorTags: ["blueberry", "raspberry", "berry", "fruit"],
    strength: "20 mg/ml",
    strengthMg: 20,
    puffs: 600,
    format: "Disposable",
    ingredients: VAPE_ING,
    description: "Blue raspberry candy profile with a soft cooling finish.",
    image: vapePurple,
    listings: listings(85, ["s2", 0, "high", 1.2], ["s4", 2, "high", 2.4]),
  },
  {
    name: "Crystal Bar Strawberry Ice",
    brand: "SKE",
    category: "vape-disposable",
    flavor: "Strawberry Ice",
    flavorTags: ["strawberry", "berry", "ice", "menthol", "fruit"],
    strength: "20 mg/ml",
    strengthMg: 20,
    puffs: 600,
    format: "Disposable",
    ingredients: VAPE_ING,
    description: "Fresh strawberry with an icy top note.",
    image: vapeRed,
    listings: listings(85, ["s1", 0, "high", 0.4], ["s6", 1, "high", 1.8]),
  },
  {
    name: "Geek Bar Pulse Mango Ice",
    brand: "Geek Bar",
    category: "vape-disposable",
    flavor: "Mango Ice",
    flavorTags: ["mango", "tropical", "ice", "fruit"],
    strength: "20 mg/ml",
    strengthMg: 20,
    puffs: 800,
    format: "Disposable",
    ingredients: VAPE_ING,
    description: "Ripe mango and pineapple with a light ice finish. Larger 800-puff capacity.",
    image: vapePurple,
    listings: listings(99, ["s2", 0, "high", 1.2], ["s4", 3, "low", 2.4]),
  },
  {
    name: "Lost Mary BM600 Blueberry Sour Raspberry",
    brand: "Lost Mary",
    category: "vape-disposable",
    flavor: "Blueberry Sour Raspberry",
    flavorTags: ["blueberry", "raspberry", "sour", "berry"],
    strength: "20 mg/ml",
    strengthMg: 20,
    puffs: 600,
    format: "Disposable",
    ingredients: VAPE_ING,
    description: "Tart raspberry over sweet blueberry with a lightly candied finish.",
    image: vapePurple,
    listings: listings(89, ["s1", 0, "high", 0.4], ["s3", 1, "high", 1.5]),
  },
  {
    name: "Onyx Mist Pen 600",
    brand: "Vaporex",
    category: "vape-disposable",
    flavor: "Blackcurrant Ice",
    flavorTags: ["berry", "blackcurrant", "ice", "menthol"],
    strength: "20 mg/ml",
    strengthMg: 20,
    puffs: 600,
    format: "Disposable",
    ingredients: VAPE_ING,
    description: "All-black disposable with a chilled blackcurrant top note. Draw-activated.",
    image: vapeBlack,
    listings: listings(89, ["s2", 0, "high", 1.2], ["s4", -4, "low", 2.4], ["s5", 6, "high", 3.1]),
  },

  // ============ REFILLABLE VAPES ============
  {
    name: "Vuse ePod 2",
    brand: "Vuse",
    category: "vape-refillable",
    flavor: "Device Kit",
    flavorTags: ["pod", "kit", "device"],
    strength: "Device",
    strengthMg: 0,
    format: "Pod system device",
    ingredients: "Battery, charging cable. Pods sold separately.",
    description: "Compact pod system with magnetic pods and USB-C charging.",
    image: vapePodSilver,
    listings: listings(199, ["s2", 0, "high", 1.2], ["s5", 10, "high", 3.1]),
  },
  {
    name: "ePod Menthol Ice Pods",
    brand: "Vuse",
    category: "vape-refillable",
    flavor: "Menthol Ice",
    flavorTags: ["menthol", "mint", "ice"],
    strength: "18 mg/ml",
    strengthMg: 18,
    format: "2-pack refill pods",
    ingredients: VAPE_ING,
    description: "Two pre-filled menthol pods for the Vuse ePod system.",
    image: vapePodSilver,
    listings: listings(99, ["s1", 0, "high", 0.4], ["s2", 2, "high", 1.2]),
  },
  {
    name: "Caliburn G3",
    brand: "Uwell",
    category: "vape-refillable",
    flavor: "Device Kit",
    flavorTags: ["pod", "kit", "device", "refillable"],
    strength: "Device",
    strengthMg: 0,
    format: "Refillable pod device",
    ingredients: "Battery, refillable pod, USB-C cable.",
    description: "Premium refillable pod with adjustable airflow and mesh coils.",
    image: vapePodSilver,
    listings: listings(349, ["s4", 0, "high", 2.4], ["s5", 15, "low", 3.1]),
  },
  {
    name: "Aurora Berry Pod",
    brand: "Aurora",
    category: "vape-refillable",
    flavor: "Mixed Berry",
    flavorTags: ["berry", "raspberry", "blueberry", "fruit"],
    strength: "18 mg/ml",
    strengthMg: 18,
    puffs: 800,
    format: "Refillable pod",
    ingredients: VAPE_ING,
    description: "Layered raspberry and blueberry with a soft warmth. For the Aurora pod system.",
    image: vapePodSilver,
    listings: listings(125, ["s2", 0, "high", 1.2], ["s4", -6, "high", 2.4], ["s5", 10, "out", 3.1]),
  },
];

export const PRODUCTS: Product[] = catalog.map((p) => ({ ...p, id: uid(p.brand, p.name) }));

// ============= Helpers =============

export function lowestPrice(p: Product): number {
  const avail = p.listings.filter((l) => l.stock !== "out").map((l) => l.price);
  return avail.length ? Math.min(...avail) : Math.min(...p.listings.map((l) => l.price));
}
export function nearestKm(p: Product): number {
  return Math.min(...p.listings.map((l) => l.distanceKm));
}
export function bestStock(p: Product): Stock {
  if (p.listings.some((l) => l.stock === "high")) return "high";
  if (p.listings.some((l) => l.stock === "low")) return "low";
  return "out";
}

export const CATEGORY_LABEL: Record<Category, string> = {
  snus: "Nicotine pouches",
  "vape-disposable": "Disposable vapes",
  "vape-refillable": "Refillable vapes",
  cigarettes: "Cigarettes",
};

export const ALL_BRANDS = Array.from(new Set(PRODUCTS.map((p) => p.brand))).sort();
export const ALL_FLAVOR_TAGS = Array.from(
  new Set(PRODUCTS.flatMap((p) => p.flavorTags))
).sort();

export function smartSearch(products: Product[], q: string): Product[] {
  const query = q.trim().toLowerCase();
  if (!query) return products;
  const tokens = query.split(/\s+/);
  return products
    .map((p) => {
      const hay = [p.name, p.brand, p.flavor, p.category, p.strength, ...p.flavorTags]
        .join(" ")
        .toLowerCase();
      let score = 0;
      for (const t of tokens) {
        if (p.brand.toLowerCase() === t) score += 5;
        if (p.brand.toLowerCase().includes(t)) score += 3;
        if (hay.includes(t)) score += 2;
        if (p.flavorTags.some((tag) => tag.includes(t) || t.includes(tag))) score += 1;
      }
      return { p, score };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((x) => x.p);
}

export type Suggestion = { label: string; kind: "brand" | "flavor" | "product" };

export function autocomplete(q: string, limit = 8): Suggestion[] {
  const query = q.trim().toLowerCase();
  if (!query) return [];
  const out: Suggestion[] = [];
  const seen = new Set<string>();
  const add = (label: string, kind: Suggestion["kind"]) => {
    const key = `${kind}:${label.toLowerCase()}`;
    if (seen.has(key)) return;
    seen.add(key);
    out.push({ label, kind });
  };
  for (const b of ALL_BRANDS) if (b.toLowerCase().includes(query)) add(b, "brand");
  for (const t of ALL_FLAVOR_TAGS) if (t.includes(query)) add(t, "flavor");
  for (const p of PRODUCTS)
    if (p.name.toLowerCase().includes(query)) add(`${p.brand} ${p.name}`, "product");
  return out.slice(0, limit);
}

export function relatedSuggestions(q: string, limit = 6): string[] {
  const results = smartSearch(PRODUCTS, q).slice(0, 10);
  const tags = new Set<string>();
  const brands = new Set<string>();
  for (const p of results) {
    p.flavorTags.forEach((t) => tags.add(t));
    brands.add(p.brand);
  }
  const query = q.trim().toLowerCase();
  const flavorList = [...tags].filter((t) => !query.includes(t));
  const brandList = [...brands].filter((b) => !query.includes(b.toLowerCase()));
  return [...brandList.slice(0, 3), ...flavorList.slice(0, 6)].slice(0, limit);
}
