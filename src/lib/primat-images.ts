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
//
// URLs harvested from retailer product pages (og:image / JSON-LD image) and
// verified against brand + product name before inclusion. The runtime
// resolver (product-image-resolver.ts) covers the long tail on demand; this
// map guarantees an instant, correct image for the most frequent hits.
const RESOLVED_EXTERNAL_PRIMAT_IMAGES: Record<string, ResolvedExternalImage> = {
  "2150199": {
    brand: "Velo",
    name: "Bright Spearmint",
    imageUrl:
      "https://handlaprivatkund.ica.se/images-v3/bf7a00ca-390e-4769-865f-dc369586872e/c6d8d97e-cbd0-40a8-bcef-c212fd07f3a7/300x300.jpg",
  },
  "2105984": {
    brand: "Velo",
    name: "Cool Storm",
    imageUrl:
      "https://handlaprivatkund.ica.se/images-v3/bf7a00ca-390e-4769-865f-dc369586872e/4433e2c4-4ca4-457c-8283-929a4c502b01/300x300.jpg",
  },
  "2031469": {
    brand: "Skruf",
    name: "Portionssnus Stark",
    imageUrl:
      "https://handlaprivatkund.ica.se/images-v3/bf7a00ca-390e-4769-865f-dc369586872e/ab15502d-0ea7-4529-ae94-51e61f986957/300x300.jpg",
  },
  "2792843": {
    brand: "",
    name: "White fox",
    imageUrl:
      "https://handlaprivatkund.ica.se/images-v3/bf7a00ca-390e-4769-865f-dc369586872e/dfbfe322-cac4-4a8f-bfe4-a62ad55540b9/300x300.jpg",
  },
  "4001566": {
    brand: "Helwit",
    name: "Banana Extra Strong",
    imageUrl:
      "https://handlaprivatkund.ica.se/images-v3/bf7a00ca-390e-4769-865f-dc369586872e/2f76e6b9-a22a-4a59-8cb5-b46299258873/300x300.jpg",
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
  const actual = normalize(`${brand} ${name}`);
  const image =
    (productId ? RESOLVED_EXTERNAL_PRIMAT_IMAGES[productId] : undefined) ??
    Object.values(RESOLVED_EXTERNAL_PRIMAT_IMAGES).find(
      (candidate) =>
        normalize(brand) === normalize(candidate.brand) &&
        normalize(candidate.name)
          .split(" ")
          .every((term) => actual.includes(term)),
    );
  if (!image) return undefined;
  return normalize(brand) === normalize(image.brand) &&
    normalize(image.name)
      .split(" ")
      .every((term) => actual.includes(term))
    ? image.imageUrl
    : undefined;
}
