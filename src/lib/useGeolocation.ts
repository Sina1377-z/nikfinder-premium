import { useEffect, useState } from "react";

export type GeoState = {
  latitude: number | null;
  longitude: number | null;
  accuracy: number | null;
  status: "idle" | "prompt" | "granted" | "denied" | "unavailable" | "error";
  error: string | null;
};

const STORAGE_KEY = "nikfinder:geo";

// Module-level singleton so the location is available anywhere in the app
// without prop drilling and is requested only once per session.
let cached: GeoState | null = null;
const listeners = new Set<(s: GeoState) => void>();
let requested = false;

function emit(next: GeoState) {
  cached = next;
  try {
    if (next.latitude != null && next.longitude != null) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    }
  } catch {
    // ignore
  }
  listeners.forEach((l) => l(next));
}

function loadCached(): GeoState {
  if (cached) return cached;
  if (typeof window === "undefined") {
    return { latitude: null, longitude: null, accuracy: null, status: "idle", error: null };
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as GeoState;
      cached = { ...parsed, status: "granted", error: null };
      return cached;
    }
  } catch {
    // ignore
  }
  cached = { latitude: null, longitude: null, accuracy: null, status: "idle", error: null };
  return cached;
}

export function requestGeolocation() {
  if (typeof window === "undefined") return;
  if (requested) return;
  requested = true;

  if (!("geolocation" in navigator)) {
    emit({ latitude: null, longitude: null, accuracy: null, status: "unavailable", error: "Geolocation not supported" });
    return;
  }

  emit({ ...loadCached(), status: "prompt" });

  navigator.geolocation.getCurrentPosition(
    (pos) => {
      emit({
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude,
        accuracy: pos.coords.accuracy,
        status: "granted",
        error: null,
      });
    },
    (err) => {
      const denied = err.code === err.PERMISSION_DENIED;
      emit({
        latitude: null,
        longitude: null,
        accuracy: null,
        status: denied ? "denied" : "error",
        error: err.message,
      });
    },
    { enableHighAccuracy: false, timeout: 10_000, maximumAge: 5 * 60_000 },
  );
}

export function getGeolocation(): GeoState {
  return loadCached();
}

export function useGeolocation(): GeoState {
  const [state, setState] = useState<GeoState>(() => loadCached());
  useEffect(() => {
    listeners.add(setState);
    requestGeolocation();
    return () => {
      listeners.delete(setState);
    };
  }, []);
  return state;
}

// Haversine distance in km — ready for when store coordinates arrive from the API.
export function distanceKm(
  a: { lat: number; lon: number },
  b: { lat: number; lon: number },
): number {
  const R = 6371;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLon = toRad(b.lon - a.lon);
  const s1 = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(s1));
}
