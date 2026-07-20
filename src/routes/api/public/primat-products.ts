import { createFileRoute } from "@tanstack/react-router";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Accept",
  "Access-Control-Max-Age": "86400",
};

export const Route = createFileRoute("/api/public/primat-products")({
  server: {
    handlers: {
      OPTIONS: async () => new Response(null, { status: 204, headers: CORS }),
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const q = url.searchParams.get("q") ?? "";
        const upstream = `https://primat.nu/api/v1/demo/products?q=${encodeURIComponent(q)}`;
        try {
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
