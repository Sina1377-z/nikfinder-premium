import { createFileRoute } from "@tanstack/react-router";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Accept",
  "Access-Control-Max-Age": "86400",
};

const CACHE_TTL_MS = 5 * 60 * 1000;
type CachedResponse = { body: string; expiresAt: number };
const responseCache = new Map<string, CachedResponse>();

export const Route = createFileRoute("/api/public/primat-products")({
  server: {
    handlers: {
      OPTIONS: async () => new Response(null, { status: 204, headers: CORS }),
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const q = url.searchParams.get("q") ?? "";
        const cacheKey = q.trim().toLocaleLowerCase("sv-SE");
        const cached = responseCache.get(cacheKey);
        if (cached && cached.expiresAt > Date.now()) {
          return new Response(cached.body, {
            headers: {
              "Content-Type": "application/json",
              "Cache-Control": "public, max-age=300",
              ...CORS,
            },
          });
        }
        const upstream = `https://primat.nu/api/v1/demo/products?q=${encodeURIComponent(q)}`;
        try {
          const res = await fetch(upstream, { headers: { Accept: "application/json" } });
          const body = await res.text();
          if (res.ok) {
            responseCache.set(cacheKey, { body, expiresAt: Date.now() + CACHE_TTL_MS });
          }
          return new Response(body, {
            status: res.status,
            headers: {
              "Content-Type": "application/json",
              "Cache-Control": "public, max-age=300",
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
