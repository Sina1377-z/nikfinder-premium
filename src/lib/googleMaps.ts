// Client-side Google Maps helpers routed through /api/public/gmaps.

export type GeoPoint = { lat: number; lng: number };

export type PlaceInfo = {
  id: string;
  name: string;
  address?: string;
  city?: string;
  location?: GeoPoint;
  openingHours?: string[];
  openNow?: boolean;
};

const BASE = "/api/public/gmaps";

// --- caches (session) ---
const cityCache = new Map<string, { city: string; country?: string }>();
const placeCache = new Map<string, PlaceInfo | null>();
const searchCache = new Map<string, PlaceInfo[]>();

const keyLL = (lat: number, lng: number) => `${lat.toFixed(3)},${lng.toFixed(3)}`;

export async function reverseGeocodeCity(lat: number, lng: number): Promise<string | null> {
  const k = keyLL(lat, lng);
  if (cityCache.has(k)) return cityCache.get(k)!.city;
  try {
    const res = await fetch(`${BASE}?op=reverse-geocode&lat=${lat}&lng=${lng}`);
    if (!res.ok) return null;
    const json = await res.json();
    const results: Array<{ address_components: Array<{ long_name: string; types: string[] }> }> =
      json.results ?? [];
    for (const r of results) {
      const comp = r.address_components ?? [];
      const city =
        comp.find((c) => c.types.includes("postal_town"))?.long_name ??
        comp.find((c) => c.types.includes("locality"))?.long_name ??
        comp.find((c) => c.types.includes("administrative_area_level_2"))?.long_name;
      if (city) {
        cityCache.set(k, { city });
        return city;
      }
    }
  } catch {
    // ignore
  }
  return null;
}

const CHAIN_LABELS: Record<string, string> = {
  ica: "ICA",
  citygross: "City Gross",
  coop: "Coop",
  willys: "Willys",
  hemkop: "Hemköp",
  hemköp: "Hemköp",
  lidl: "Lidl",
  tempo: "Tempo",
  pressbyran: "Pressbyrån",
  pressbyrån: "Pressbyrån",
  seven: "7-Eleven",
  "7eleven": "7-Eleven",
  circlek: "Circle K",
};

export function chainLabel(chain: string): string {
  const c = chain.toLowerCase().replace(/[^a-z0-9]/g, "");
  return CHAIN_LABELS[c] ?? (chain.charAt(0).toUpperCase() + chain.slice(1));
}

export async function findStoresByChain(
  chain: string,
  near: GeoPoint,
  radiusMeters = 20_000,
): Promise<PlaceInfo[]> {
  const label = chainLabel(chain);
  const cacheKey = `${label}|${near.lat.toFixed(2)},${near.lng.toFixed(2)}|${radiusMeters}`;
  if (searchCache.has(cacheKey)) return searchCache.get(cacheKey)!;
  try {
    const res = await fetch(`${BASE}?op=search-text`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        textQuery: label,
        locationBias: {
          circle: { center: { latitude: near.lat, longitude: near.lng }, radius: radiusMeters },
        },
        maxResultCount: 20,
        regionCode: "SE",
      }),
    });
    if (!res.ok) {
      searchCache.set(cacheKey, []);
      return [];
    }
    const json = await res.json();
    const places = (json.places ?? []).map(mapPlace);
    searchCache.set(cacheKey, places);
    for (const p of places) placeCache.set(p.id, p);
    return places;
  } catch {
    searchCache.set(cacheKey, []);
    return [];
  }
}

export async function getPlaceDetails(placeId: string): Promise<PlaceInfo | null> {
  if (placeCache.has(placeId)) return placeCache.get(placeId) ?? null;
  try {
    const res = await fetch(`${BASE}?op=place-details&place_id=${encodeURIComponent(placeId)}`);
    if (!res.ok) {
      placeCache.set(placeId, null);
      return null;
    }
    const json = await res.json();
    const info = mapPlace(json);
    placeCache.set(placeId, info);
    return info;
  } catch {
    return null;
  }
}

type RawPlace = {
  id?: string;
  displayName?: { text?: string };
  formattedAddress?: string;
  location?: { latitude?: number; longitude?: number };
  regularOpeningHours?: { weekdayDescriptions?: string[]; openNow?: boolean };
  currentOpeningHours?: { weekdayDescriptions?: string[]; openNow?: boolean };
};

function mapPlace(p: RawPlace): PlaceInfo {
  const hours = p.currentOpeningHours ?? p.regularOpeningHours;
  const address = p.formattedAddress;
  // Derive city from address (Swedish format: "Street, ZIP City, Sweden").
  let city: string | undefined;
  if (address) {
    const parts = address.split(",").map((s) => s.trim());
    // Middle part usually "ZIP City"
    const mid = parts[parts.length - 2] ?? "";
    const m = mid.match(/\d{3}\s?\d{2}\s+(.+)/);
    city = m?.[1] ?? (mid || undefined);
  }
  return {
    id: p.id ?? "",
    name: p.displayName?.text ?? "Butik",
    address,
    city,
    location:
      p.location?.latitude != null && p.location?.longitude != null
        ? { lat: p.location.latitude, lng: p.location.longitude }
        : undefined,
    openingHours: hours?.weekdayDescriptions,
    openNow: hours?.openNow,
  };
}

export function googleMapsNavigateUrl(dest: { address?: string; location?: GeoPoint; name?: string }): string {
  if (dest.location) {
    return `https://www.google.com/maps/dir/?api=1&destination=${dest.location.lat},${dest.location.lng}`;
  }
  const q = encodeURIComponent(dest.address ?? dest.name ?? "");
  return `https://www.google.com/maps/dir/?api=1&destination=${q}`;
}
