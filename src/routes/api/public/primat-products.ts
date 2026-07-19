import { createFileRoute } from "@tanstack/react-router";
import { PRIMAT_DISCOVERY_QUERIES } from "@/lib/primat-discovery";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Accept",
  "Access-Control-Max-Age": "86400",
};

type CachedCatalog = { expiresAt: number; body: string };
let catalogCache: CachedCatalog | null = null;
const CATALOG_CACHE_MS = 24 * 60 * 60 * 1000;

async function fetchDemo(query: string) {
  const upstream = `https://primat.nu/api/v1/demo/products?q=${encodeURIComponent(query)}`;
  const response = await fetch(upstream, { headers: { Accept: "application/json" } });
  if (!response.ok) throw new Error(`Primat demo error: ${response.status}`);
  return response.json() as Promise<{ data?: unknown[]; note?: string }>;
}

export const Route = createFileRoute("/api/public/primat-products")({
  server: {
    handlers: {
      OPTIONS: async () => new Response(null, { status: 204, headers: CORS }),
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const wantsCatalog = url.searchParams.get("catalog") === "1";
        if (wantsCatalog && catalogCache && catalogCache.expiresAt > Date.now()) {
          return new Response(catalogCache.body, {
            headers: {
              "Content-Type": "application/json",
              "Cache-Control": "public, max-age=300",
              ...CORS,
            },
          });
        }
        const q = url.searchParams.get("q") ?? "";
        try {
          if (wantsCatalog) {
            const responses = await Promise.all(PRIMAT_DISCOVERY_QUERIES.map(fetchDemo));
            const data = responses.flatMap((response) => response.data ?? []);
            const body = JSON.stringify({
              demo: true,
              count: data.length,
              note: `Demo discovery catalog from ${PRIMAT_DISCOVERY_QUERIES.length} documented queries; cached for 24 hours.`,
              data,
            });
            catalogCache = { body, expiresAt: Date.now() + CATALOG_CACHE_MS };
            return new Response(body, {
              headers: {
                "Content-Type": "application/json",
                "Cache-Control": "public, max-age=300",
                ...CORS,
              },
            });
          }

          const upstream = `https://primat.nu/api/v1/demo/products?q=${encodeURIComponent(q)}`;
          const res = await fetch(upstream, { headers: { Accept: "application/json" } });
          const body = await res.text();
          return new Response(body, {
            status: res.status,
            headers: {
              "Content-Type": "application/json",
              "Cache-Control": "public, max-age=30",
              ...CORS,
            },
          });
        } catch (err) {
          return new Response(
            JSON.stringify({ error: (err as Error).message || "Upstream error" }),
            { status: 502, headers: { "Content-Type": "application/json", ...CORS } },
          );
        }
      },
    },
  },
});
