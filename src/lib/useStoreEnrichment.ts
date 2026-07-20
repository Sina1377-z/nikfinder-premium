import { useEffect, useState } from "react";
import { STORES } from "@/lib/products";
import type { Product } from "@/lib/catalog/types";
import {
  findStoresByChain,
  getPlaceDetails,
  type GeoPoint,
  type PlaceInfo,
} from "@/lib/googleMaps";
import { distanceKm } from "@/lib/useGeolocation";

// Assigns real Google Places store info (name, address, coords, hours) to
// each unique primat chain+store_id combo, biased around the user's location.
// Also fills listing.distanceKm. Mutates STORES/products in place and returns
// a version counter so React can re-render.

const enrichedChains = new Set<string>(); // key: chain|latRound,lngRound
const enrichedStores = new Set<string>(); // storeId

export function useStoreEnrichment(products: Product[], user: GeoPoint | null): number {
  const [version, setVersion] = useState(0);

  useEffect(() => {
    if (!user) return;
    if (!products.length) return;

    const primatStores = new Map<string, string[]>(); // chain -> [storeId,...]
    for (const p of products) {
      for (const l of p.listings) {
        const s = STORES[l.storeId];
        if (!s?.chain) continue;
        if (enrichedStores.has(l.storeId)) continue;
        if (!primatStores.has(s.chain)) primatStores.set(s.chain, []);
        primatStores.get(s.chain)!.push(l.storeId);
      }
    }
    if (primatStores.size === 0) return;

    let cancelled = false;
    (async () => {
      const key = (c: string) => `${c}|${user.lat.toFixed(2)},${user.lng.toFixed(2)}`;
      await Promise.all(
        Array.from(primatStores.entries()).map(async ([chain, ids]) => {
          if (enrichedChains.has(key(chain))) {
            assignPlaces(chain, ids); // reuse cached search results
            return;
          }
          const places = await findStoresByChain(chain, user, 20_000);
          enrichedChains.add(key(chain));
          if (!places.length) return;
          assignPlaces(chain, ids, places);
        }),
      );
      // Compute distances for every listing.
      for (const p of products) {
        for (const l of p.listings) {
          const s = STORES[l.storeId];
          if (s?.lat != null && s?.lng != null) {
            l.distanceKm = +distanceKm(
              { lat: user.lat, lon: user.lng },
              { lat: s.lat, lon: s.lng },
            ).toFixed(2);
          }
        }
      }
      if (!cancelled) setVersion((v) => v + 1);
    })();

    return () => {
      cancelled = true;
    };
  }, [products, user]);

  return version;
}

// Cache of chain -> ordered PlaceInfo[] (nearest first) for reassignment.
const chainPlaces = new Map<string, PlaceInfo[]>();

function assignPlaces(chain: string, storeIds: string[], places?: PlaceInfo[]) {
  const list = places ?? chainPlaces.get(chain) ?? [];
  if (places) chainPlaces.set(chain, places);
  if (!list.length) return;
  // Deterministic mapping: hash of storeId picks a place index; ensures the
  // same storeId always resolves to the same Place while giving variety.
  storeIds.forEach((storeId) => {
    if (enrichedStores.has(storeId)) return;
    const s = STORES[storeId];
    if (!s) return;
    let h = 0;
    for (let i = 0; i < storeId.length; i++) h = (h * 31 + storeId.charCodeAt(i)) >>> 0;
    const place = list[h % list.length];
    s.placeId = place.id;
    s.name = place.name;
    s.address = place.address;
    s.city = place.city;
    if (place.location) {
      s.lat = place.location.lat;
      s.lng = place.location.lng;
    }
    if (place.openingHours?.length) {
      s.openingHours = place.openingHours;
      s.hours = place.openNow === false ? "Closed" : "Open now";
    }
    enrichedStores.add(storeId);
  });
}

export async function fetchStoreHours(storeId: string): Promise<string[] | null> {
  const s = STORES[storeId];
  if (!s?.placeId) return null;
  if (s.openingHours?.length) return s.openingHours;
  const info = await getPlaceDetails(s.placeId);
  if (info?.openingHours?.length) {
    s.openingHours = info.openingHours;
    return info.openingHours;
  }
  return null;
}
