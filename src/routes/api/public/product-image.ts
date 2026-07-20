import { createFileRoute } from "@tanstack/react-router";

const CACHE_TTL_MS = 24 * 60 * 60 * 1000;
const MAX_SOURCE_LENGTH = 500;
const ALLOWED_SOURCE_HOSTS = new Set([
  "hemkop.se",
  "www.hemkop.se",
  "ica.se",
  "www.ica.se",
  "coop.se",
  "www.coop.se",
  "willys.se",
  "www.willys.se",
]);

type CachedImage = { expiresAt: number; imageUrl: string | null };
type ImageCandidate = { url: string; area: number };
type ProductMetadata = { name: string; brand: string; image: unknown };

const imageCache = new Map<string, CachedImage>();

function normalize(value: string): string {
  return value
    .toLocaleLowerCase("sv-SE")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function words(value: string): string[] {
  return normalize(value)
    .split(" ")
    .filter((word) => word.length > 2);
}

function matchesProduct(metadataName: string, metadataBrand: string, name: string, brand: string) {
  const source = normalize(`${metadataBrand} ${metadataName}`);
  const brandWords = words(brand);
  const nameWords = words(name);
  if (!brandWords.every((word) => source.includes(word))) return false;
  const matchedNameWords = nameWords.filter((word) => source.includes(word)).length;
  return matchedNameWords >= Math.min(2, nameWords.length);
}

function imageCandidates(value: unknown): ImageCandidate[] {
  const values = Array.isArray(value) ? value : [value];
  return values.flatMap((entry) => {
    if (typeof entry === "string")
      return /^https:\/\//i.test(entry) ? [{ url: entry, area: 0 }] : [];
    if (!entry || typeof entry !== "object") return [];
    const image = entry as {
      url?: unknown;
      contentUrl?: unknown;
      width?: unknown;
      height?: unknown;
    };
    const url = typeof image.url === "string" ? image.url : image.contentUrl;
    if (typeof url !== "string" || !/^https:\/\//i.test(url)) return [];
    const width = typeof image.width === "number" ? image.width : 0;
    const height = typeof image.height === "number" ? image.height : 0;
    return [{ url, area: width * height }];
  });
}

function parseJsonLd(html: string): ProductMetadata[] {
  const scripts = html.matchAll(
    /<script[^>]+type=["']application\/ld\+json[^>]*>([\s\S]*?)<\/script>/gi,
  );
  const metadata: ProductMetadata[] = [];
  for (const match of scripts) {
    try {
      const parsed = JSON.parse(match[1]) as unknown;
      const values = Array.isArray(parsed) ? parsed : [parsed];
      for (const value of values) {
        const graph =
          value && typeof value === "object" && "@graph" in value
            ? (value as { "@graph": unknown[] })["@graph"]
            : [value];
        for (const item of graph) {
          if (!item || typeof item !== "object") continue;
          const product = item as { name?: unknown; brand?: unknown; image?: unknown };
          const brand =
            typeof product.brand === "string"
              ? product.brand
              : typeof product.brand === "object" && product.brand && "name" in product.brand
                ? String((product.brand as { name?: unknown }).name ?? "")
                : "";
          if (typeof product.name === "string" && product.image) {
            metadata.push({ name: product.name, brand, image: product.image });
          }
        }
      }
    } catch {
      // Ignore invalid structured data and try another metadata format.
    }
  }
  return metadata;
}

function metaContent(html: string, property: string): string | undefined {
  const escaped = property.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = html.match(
    new RegExp(
      `<meta[^>]+(?:property|name)=["']${escaped}["'][^>]+content=["']([^"']+)["'][^>]*>`,
      "i",
    ),
  );
  return match?.[1];
}

function resolveImageFromMetadata(html: string, name: string, brand: string): string | null {
  const jsonLdCandidates = parseJsonLd(html)
    .filter((product) => matchesProduct(product.name, product.brand, name, brand))
    .flatMap((product) => imageCandidates(product.image));

  const metaName = metaContent(html, "og:title") ?? "";
  const metaImage = metaContent(html, "og:image");
  const width = Number(metaContent(html, "og:image:width")) || 0;
  const height = Number(metaContent(html, "og:image:height")) || 0;
  const metaCandidates =
    metaImage && matchesProduct(metaName, "", name, brand)
      ? [{ url: metaImage, area: width * height }]
      : [];

  return [...jsonLdCandidates, ...metaCandidates].sort((a, b) => b.area - a.area)[0]?.url ?? null;
}

function validSource(value: string): URL | null {
  if (value.length > MAX_SOURCE_LENGTH) return null;
  try {
    const source = new URL(value);
    return source.protocol === "https:" && ALLOWED_SOURCE_HOSTS.has(source.hostname)
      ? source
      : null;
  } catch {
    return null;
  }
}

export const Route = createFileRoute("/api/public/product-image")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const requestUrl = new URL(request.url);
        const source = validSource(requestUrl.searchParams.get("source") ?? "");
        const brand = requestUrl.searchParams.get("brand")?.trim() ?? "";
        const name = requestUrl.searchParams.get("name")?.trim() ?? "";
        if (!source || !brand || !name) return Response.json({ imageUrl: null }, { status: 400 });

        const cacheKey = `${source.href}|${normalize(brand)}|${normalize(name)}`;
        const cached = imageCache.get(cacheKey);
        if (cached && cached.expiresAt > Date.now()) {
          return Response.json(cached, { headers: { "Cache-Control": "public, max-age=86400" } });
        }

        let imageUrl: string | null = null;
        try {
          const response = await fetch(source, {
            headers: { Accept: "text/html" },
            signal: AbortSignal.timeout(5_000),
          });
          if (response.ok && response.headers.get("content-type")?.includes("text/html")) {
            imageUrl = resolveImageFromMetadata(await response.text(), name, brand);
          }
        } catch {
          // A missing external image must not affect product search.
        }

        const result = { imageUrl, expiresAt: Date.now() + CACHE_TTL_MS };
        imageCache.set(cacheKey, result);
        return Response.json(result, { headers: { "Cache-Control": "public, max-age=86400" } });
      },
    },
  },
});
