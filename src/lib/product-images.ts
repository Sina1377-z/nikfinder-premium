// Verified local product images. Keep this separate from Primat data so an
// eventual official image field from Primat can take precedence without UI changes.
export type VerifiedProductImage = {
  src: string;
  sourceUrl: string;
  match: "exact-product-id";
};

const VERIFIED_PRODUCT_IMAGES: Record<string, VerifiedProductImage> = {
  // Vont's official product page identifies this as "Vont Cube Breezy Watermelon"
  // and supplies the image stored locally below.
  "101584142_ST": {
    src: "/images/products/vont-cube-breezy-watermelon.webp",
    sourceUrl: "https://www.vont.se/product/vont-cube-breezy-watermelon-20-mg-ml",
    match: "exact-product-id",
  },
};

export function getVerifiedProductImage(productId: string | undefined): string | undefined {
  return productId ? VERIFIED_PRODUCT_IMAGES[productId]?.src : undefined;
}

export { VERIFIED_PRODUCT_IMAGES };
