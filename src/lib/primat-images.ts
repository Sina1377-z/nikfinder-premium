// Exact Primat product IDs with verified local product photography. Keep this
// provider-specific mapping separate so a future provider can supply images
// without changing any UI component.
const VERIFIED_PRIMAT_PRODUCT_IMAGES: Record<string, string> = {
  "101584142_ST": "/images/products/vont-cube-breezy-watermelon.webp",
};

type ResolvedExternalImage = {
  brand: string;
  name: string;
  imageUrl: string;
};

// High-confidence, exact-brand/name matches from retailer product metadata.
// This is a small cache, not a general image catalogue; future provider images
// should replace these entries without requiring any UI change.
const RESOLVED_EXTERNAL_PRIMAT_IMAGES: Record<string, ResolvedExternalImage> = {
  "2150199": {
    brand: "Velo",
    name: "Bright Spearmint",
    imageUrl:
      "https://v3-media-we.northerner.com/uknorthr/images/plytix-6660261305ce00f36843eec8/500/500/fill/n/plytix-6660261305ce00f36843eec8-png.png",
  },
  "101855121_ST": {
    brand: "ZYN",
    name: "Black Cherry Slim",
    imageUrl:
      "https://v3-media-se.snusbolaget.se/sesnusbo/images/plytix-6968bb27d12f96271c5e9804/500/500/fill/n/plytix-6968bb27d12f96271c5e9804-png.png",
  },
  "101543266_ST": {
    brand: "XQS",
    name: "Wintergreen",
    imageUrl:
      "https://v3-media-we.haypp.com/ukhaypp/images/plytix-6a01a7fde37a8b83f7ebc75d/500/500/fill/n/plytix-6a01a7fde37a8b83f7ebc75d-png.png",
  },
  "101543291_ST": {
    brand: "XQS",
    name: "Wintergreen",
    imageUrl:
      "https://v3-media-we.haypp.com/ukhaypp/images/plytix-6a01a7fde37a8b83f7ebc75d/500/500/fill/n/plytix-6a01a7fde37a8b83f7ebc75d-png.png",
  },
  "101584140_ST": {
    brand: "Vont",
    name: "Cube Cherry Berry",
    imageUrl:
      "https://v3-media-se.nettotobak.com/senettob/images/plytix-67dbc3f343f275ec564bac34/500/500/fill/n/plytix-67dbc3f343f275ec564bac34-png.png",
  },
  "101684718_ST": {
    brand: "Rev Pod Max",
    name: "Strawberry Split",
    imageUrl:
      "https://v3-media-se.nettotobak.com/senettob/images/plytix-6981dedc6241964a4f797c43/500/500/fill/n/plytix-6981dedc6241964a4f797c43-png.png",
  },
};

function normalize(value: string): string {
  return value
    .toLocaleLowerCase("sv-SE")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

export function getVerifiedPrimatProductImage(productId: string | undefined): string | undefined {
  return productId ? VERIFIED_PRIMAT_PRODUCT_IMAGES[productId] : undefined;
}

export function getResolvedPrimatProductImage(
  productId: string | undefined,
  brand: string,
  name: string,
): string | undefined {
  if (!productId) return undefined;
  const image = RESOLVED_EXTERNAL_PRIMAT_IMAGES[productId];
  if (!image) return undefined;
  const actual = normalize(`${brand} ${name}`);
  return normalize(brand) === normalize(image.brand) &&
    normalize(image.name)
      .split(" ")
      .every((term) => actual.includes(term))
    ? image.imageUrl
    : undefined;
}
