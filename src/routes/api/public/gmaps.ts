import { createFileRoute } from "@tanstack/react-router";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Accept",
  "Access-Control-Max-Age": "86400",
};

const GATEWAY = "https://connector-gateway.lovable.dev/google_maps";

async function callGateway(path: string, init: RequestInit = {}) {
  const apiKey = process.env.LOVABLE_API_KEY;
  const gKey = process.env.GOOGLE_MAPS_API_KEY;
  if (!apiKey || !gKey) {
    return new Response(JSON.stringify({ error: "Google Maps connector not configured" }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...CORS },
    });
  }
  const headers = new Headers(init.headers);
  headers.set("Authorization", `Bearer ${apiKey}`);
  headers.set("X-Connection-Api-Key", gKey);
  if (init.body && !headers.has("Content-Type")) headers.set("Content-Type", "application/json");
  try {
    const res = await fetch(`${GATEWAY}${path}`, { ...init, headers });
    const body = await res.text();
    return new Response(body, {
      status: res.status,
      headers: {
        "Content-Type": res.headers.get("Content-Type") ?? "application/json",
        "Cache-Control": "public, max-age=300",
        ...CORS,
      },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: (err as Error).message || "Upstream error" }), {
      status: 502,
      headers: { "Content-Type": "application/json", ...CORS },
    });
  }
}

export const Route = createFileRoute("/api/public/gmaps")({
  server: {
    handlers: {
      OPTIONS: async () => new Response(null, { status: 204, headers: CORS }),
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const op = url.searchParams.get("op");

        if (op === "reverse-geocode") {
          const lat = url.searchParams.get("lat");
          const lng = url.searchParams.get("lng");
          if (!lat || !lng) {
            return new Response(JSON.stringify({ error: "Missing lat/lng" }), {
              status: 400,
              headers: { "Content-Type": "application/json", ...CORS },
            });
          }
          return callGateway(`/maps/api/geocode/json?latlng=${lat},${lng}&language=sv`);
        }

        if (op === "place-details") {
          const placeId = url.searchParams.get("place_id");
          if (!placeId) {
            return new Response(JSON.stringify({ error: "Missing place_id" }), {
              status: 400,
              headers: { "Content-Type": "application/json", ...CORS },
            });
          }
          const fields =
            "id,displayName,formattedAddress,location,regularOpeningHours,currentOpeningHours";
          return callGateway(`/places/v1/places/${encodeURIComponent(placeId)}`, {
            method: "GET",
            headers: { "X-Goog-FieldMask": fields },
          });
        }

        return new Response(JSON.stringify({ error: "Unknown op" }), {
          status: 400,
          headers: { "Content-Type": "application/json", ...CORS },
        });
      },
      POST: async ({ request }) => {
        const url = new URL(request.url);
        const op = url.searchParams.get("op");
        if (op === "search-text") {
          const body = await request.json().catch(() => ({}));
          const fields =
            "places.id,places.displayName,places.formattedAddress,places.location,places.regularOpeningHours,places.currentOpeningHours";
          return callGateway(`/places/v1/places:searchText`, {
            method: "POST",
            body: JSON.stringify(body),
            headers: { "X-Goog-FieldMask": fields },
          });
        }
        if (op === "search-nearby") {
          const body = await request.json().catch(() => ({}));
          const fields =
            "places.id,places.displayName,places.formattedAddress,places.location,places.regularOpeningHours,places.currentOpeningHours";
          return callGateway(`/places/v1/places:searchNearby`, {
            method: "POST",
            body: JSON.stringify(body),
            headers: { "X-Goog-FieldMask": fields },
          });
        }
        return new Response(JSON.stringify({ error: "Unknown op" }), {
          status: 400,
          headers: { "Content-Type": "application/json", ...CORS },
        });
      },
    },
  },
});
