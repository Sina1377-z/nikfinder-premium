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
  // Snusbolaget verified matches (og:image from official product pages).
  "5715345031828": {
    brand: "Lundgrens",
    name: "Vit Portion",
    imageUrl:
      "https://v3-media-se.snusbolaget.se/sesnusbo/images/plytix-6926c6ac5523afe83482805d/500/500/fill/n/plytix-6926c6ac5523afe83482805d-png.png",
  },
  "5715345031859": {
    brand: "Lundgrens",
    name: "Vit Portion",
    imageUrl:
      "https://v3-media-se.snusbolaget.se/sesnusbo/images/plytix-6926c6ac5523afe83482805d/500/500/fill/n/plytix-6926c6ac5523afe83482805d-png.png",
  },
  "7311250009501": {
    brand: "General Extra Strong",
    name: "Extra Stark",
    imageUrl:
      "https://v3-media-se.snusbolaget.se/sesnusbo/images/plytix-68d67e9e6d9b6052b0975711/500/500/fill/n/plytix-68d67e9e6d9b6052b0975711-png.png",
  },
  "7311250007422": {
    brand: "XR",
    name: "General Strong Slim White",
    imageUrl:
      "https://v3-media-se.snusbolaget.se/sesnusbo/images/plytix-68d68223bf4298108701f021/500/500/fill/n/plytix-68d68223bf4298108701f021-png.png",
  },
  "7311250449246": {
    brand: "Ettan",
    name: "Lös",
    imageUrl:
      "https://v3-media-se.snusbolaget.se/sesnusbo/images/plytix-68d53042fbe763f16cbf5578/500/500/fill/n/plytix-68d53042fbe763f16cbf5578-png.png",
  },
  "7311250449765": {
    brand: "Ettan",
    name: "Portion White",
    imageUrl:
      "https://v3-media-se.snusbolaget.se/sesnusbo/images/plytix-68d53096723a0fd32c9349dd/500/500/fill/n/plytix-68d53096723a0fd32c9349dd-png.png",
  },
  "7311250448751": {
    brand: "Ettan",
    name: "Original Portion",
    imageUrl:
      "https://v3-media-se.snusbolaget.se/sesnusbo/images/plytix-68d5306cf451e049fecc97fb/500/500/fill/n/plytix-68d5306cf451e049fecc97fb-png.png",
  },
  "7330196002766": {
    brand: "skruf",
    name: "White Stark",
    imageUrl:
      "https://v3-media-se.snusbolaget.se/sesnusbo/images/plytix-69b155911c6bf5731609a6be/500/500/fill/n/plytix-69b155911c6bf5731609a6be-png.png",
  },
  "7350122212144": {
    brand: "Helwit",
    name: "Cola",
    imageUrl:
      "https://v3-media-se.snusbolaget.se/sesnusbo/images/plytix-6901d935b5c8d22d955f249b/500/500/fill/n/plytix-6901d935b5c8d22d955f249b-png.png",
  },
  "7350122210010": {
    brand: "Helwit",
    name: "Orange",
    imageUrl:
      "https://v3-media-se.snusbolaget.se/sesnusbo/images/plytix-69ddf1300aa726106a987a7d/500/500/fill/n/plytix-69ddf1300aa726106a987a7d-png.png",
  },
  "7350013611773": {
    brand: "Knox",
    name: "White",
    imageUrl:
      "https://v3-media-se.snusbolaget.se/sesnusbo/images/plytix-6909e19d808012c5064c8903/500/500/fill/n/plytix-6909e19d808012c5064c8903-png.png",
  },
  "7350139644488": {
    brand: "Knox",
    name: "Portion",
    imageUrl:
      "https://v3-media-se.snusbolaget.se/sesnusbo/images/plytix-6909e1384fe516bf3440e030/500/500/fill/n/plytix-6909e1384fe516bf3440e030-png.png",
  },
  "7350139646659": {
    brand: "Knox",
    name: "Yellow White",
    imageUrl:
      "https://v3-media-se.snusbolaget.se/sesnusbo/images/plytix-6909e01f4fe516bf3440dfeb/500/500/fill/n/plytix-6909e01f4fe516bf3440dfeb-png.png",
  },
  "7350139644402": {
    brand: "Knox",
    name: "Lös",
    imageUrl:
      "https://v3-media-se.snusbolaget.se/sesnusbo/images/plytix-6909e10184ed40de5d512b54/500/500/fill/n/plytix-6909e10184ed40de5d512b54-png.png",
  },
  "101544230_ST": {
    brand: "Velo",
    name: "Crispy Peppermint",
    imageUrl:
      "https://v3-media-se.snusbolaget.se/sesnusbo/images/plytix-69207c57a13e79c9c25016a8/500/500/fill/n/plytix-69207c57a13e79c9c25016a8-png.png",
  },
  "101855133_ST": {
    brand: "ZYN",
    name: "Blackcurrant Ice",
    imageUrl:
      "https://v3-media-se.snusbolaget.se/sesnusbo/images/plytix-69f84db321442fb771d22208/500/500/fill/n/plytix-69f84db321442fb771d22208-png.png",
  },
  "101855123_ST": {
    brand: "ZYN",
    name: "Cactus Spice",
    imageUrl:
      "https://v3-media-se.snusbolaget.se/sesnusbo/images/plytix-69f84e7e21442fb771d22224/500/500/fill/n/plytix-69f84e7e21442fb771d22224-png.png",
  },
  "2019450": {
    brand: "Zyn",
    name: "Citrus",
    imageUrl:
      "https://v3-media-se.snusbolaget.se/sesnusbo/images/plytix-6a03112e654edd396aa690c5/500/500/fill/n/plytix-6a03112e654edd396aa690c5-png.png",
  },
  "2045538": {
    brand: "Zyn",
    name: "Spearmint",
    imageUrl:
      "https://v3-media-se.snusbolaget.se/sesnusbo/images/plytix-6a030b584e82104be30619da/500/500/fill/n/plytix-6a030b584e82104be30619da-png.png",
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
