// Exact Primat product IDs with verified local product photography. Keep this
// provider-specific mapping separate so a future provider can supply images
// without changing any UI component.
const VERIFIED_PRIMAT_PRODUCT_IMAGES: Record<string, string> = {
  "101584142_ST": "/images/products/vont-cube-breezy-watermelon.webp",
};

export function getVerifiedPrimatProductImage(productId: string | undefined): string | undefined {
  return productId ? VERIFIED_PRIMAT_PRODUCT_IMAGES[productId] : undefined;
}
