type ProductImageRequest = {
  sourceUrl?: string;
  brand: string;
  name: string;
};

const resolvedImages = new Map<string, string | null>();
const pendingLookups = new Map<string, Promise<string | null>>();

function cacheKey({ sourceUrl, brand, name }: ProductImageRequest): string {
  return `${sourceUrl ?? ""}|${brand.trim().toLocaleLowerCase("sv-SE")}|${name
    .trim()
    .toLocaleLowerCase("sv-SE")}`;
}

export function resolveExternalProductImage(request: ProductImageRequest): Promise<string | null> {
  if (!request.sourceUrl) return Promise.resolve(null);
  const key = cacheKey(request);
  const resolved = resolvedImages.get(key);
  if (resolved !== undefined) return Promise.resolve(resolved);
  const pending = pendingLookups.get(key);
  if (pending) return pending;

  const lookup = fetch(
    `/api/public/product-image?${new URLSearchParams({
      source: request.sourceUrl,
      brand: request.brand,
      name: request.name,
    })}`,
  )
    .then(async (response) => {
      if (!response.ok) return null;
      const data = (await response.json()) as { imageUrl?: unknown };
      return typeof data.imageUrl === "string" && /^https:\/\//i.test(data.imageUrl)
        ? data.imageUrl
        : null;
    })
    .catch(() => null)
    .then((imageUrl) => {
      resolvedImages.set(key, imageUrl);
      pendingLookups.delete(key);
      return imageUrl;
    });

  pendingLookups.set(key, lookup);
  return lookup;
}
