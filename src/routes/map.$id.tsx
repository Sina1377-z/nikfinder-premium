import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ChevronLeft } from "lucide-react";
import { STORES } from "@/lib/products";
import { productCatalog } from "@/lib/catalog/defaultCatalog";
import { useGeolocation } from "@/lib/useGeolocation";
import { useStoreEnrichment } from "@/lib/useStoreEnrichment";
import { googleMapsNavigateUrl } from "@/lib/googleMaps";

export const Route = createFileRoute("/map/$id")({
  loader: ({ params }) => {
    const product = productCatalog.getProductById(params.id);
    if (!product) throw notFound();
    return { product };
  },
  component: MapPage,
  notFoundComponent: () => (
    <div className="flex min-h-screen items-center justify-center px-6 text-center">
      <div>
        <h1 className="font-display text-2xl font-bold">Product not found</h1>
        <Link to="/" className="mt-4 inline-block text-primary">
          Back home
        </Link>
      </div>
    </div>
  ),
});

declare global {
  interface Window {
    google?: typeof google;
    __nikfinderMapReady?: () => void;
  }
}

let mapsLoader: Promise<void> | null = null;
function loadMaps(): Promise<void> {
  if (mapsLoader) return mapsLoader;
  mapsLoader = new Promise((resolve, reject) => {
    if (typeof window === "undefined") return resolve();
    if (window.google?.maps) return resolve();
    const key = import.meta.env.VITE_LOVABLE_CONNECTOR_GOOGLE_MAPS_BROWSER_KEY;
    if (!key) return reject(new Error("Missing Google Maps browser key"));
    window.__nikfinderMapReady = () => resolve();
    const s = document.createElement("script");
    s.src = `https://maps.googleapis.com/maps/api/js?key=${key}&loading=async&callback=__nikfinderMapReady`;
    s.async = true;
    s.onerror = () => reject(new Error("Failed to load Google Maps"));
    document.head.appendChild(s);
  });
  return mapsLoader;
}

function MapPage() {
  const { product } = Route.useLoaderData();
  const geo = useGeolocation();
  const userPoint =
    geo.latitude != null && geo.longitude != null
      ? { lat: geo.latitude, lng: geo.longitude }
      : null;
  const enrichVersion = useStoreEnrichment([product], userPoint);
  const mapRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    loadMaps()
      .then(() => setReady(true))
      .catch((e) => setErr(e.message));
  }, []);

  useEffect(() => {
    if (!ready || !mapRef.current || !window.google?.maps) return;
    const listings = (
      product.listings as Array<{
        storeId: string;
        price: number;
        distanceKm: number;
        stock: string;
      }>
    )
      .map((l) => ({ l, s: STORES[l.storeId] }))
      .filter((x) => x.s?.lat != null && x.s?.lng != null);

    const center =
      userPoint ??
      (listings[0]
        ? { lat: listings[0].s.lat!, lng: listings[0].s.lng! }
        : { lat: 59.3293, lng: 18.0686 });

    const map = new google.maps.Map(mapRef.current, {
      center,
      zoom: 13,
      disableDefaultUI: true,
      zoomControl: true,
      styles: [
        { elementType: "geometry", stylers: [{ color: "#0f1218" }] },
        { elementType: "labels.text.stroke", stylers: [{ color: "#0f1218" }] },
        { elementType: "labels.text.fill", stylers: [{ color: "#8f96a3" }] },
        { featureType: "road", elementType: "geometry", stylers: [{ color: "#1b2028" }] },
        { featureType: "water", elementType: "geometry", stylers: [{ color: "#0a0d12" }] },
        { featureType: "poi", stylers: [{ visibility: "off" }] },
      ],
    });

    const bounds = new google.maps.LatLngBounds();
    if (userPoint) {
      new google.maps.Marker({
        position: userPoint,
        map,
        title: "You",
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 8,
          fillColor: "#22d3ee",
          fillOpacity: 1,
          strokeColor: "#ffffff",
          strokeWeight: 2,
        },
      });
      bounds.extend(userPoint);
    }

    const sortedListings = [...listings].sort(
      (a, b) => (a.l.distanceKm || 0) - (b.l.distanceKm || 0),
    );
    sortedListings.forEach(({ l, s }, i) => {
      const isNearest = i === 0;
      const pos = { lat: s.lat!, lng: s.lng! };
      const marker = new google.maps.Marker({
        position: pos,
        map,
        title: s.name,
        label: {
          text: `${l.price.toFixed(0)}`,
          color: "#ffffff",
          fontSize: "11px",
          fontWeight: "700",
        },
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 16,
          fillColor: isNearest ? "#22c55e" : "#3b82f6",
          fillOpacity: 1,
          strokeColor: "#ffffff",
          strokeWeight: 2,
        },
      });
      const hours = s.openingHours?.slice(0, 3).join("<br/>") ?? "Opening hours unavailable";
      const info = new google.maps.InfoWindow({
        content: `
          <div style="font-family:system-ui;color:#0f172a;min-width:180px">
            <div style="font-weight:700;font-size:13px">${s.name}</div>
            <div style="font-size:11px;color:#475569">${s.address ?? ""}</div>
            <div style="margin-top:6px;font-size:12px"><b>${l.price.toFixed(2)} SEK</b>${l.distanceKm ? ` · ${l.distanceKm.toFixed(1)} km` : ""}</div>
            <div style="margin-top:4px;font-size:11px;color:#475569">${hours}</div>
            <div style="margin-top:8px;display:flex;gap:6px">
              <a href="/product/${product.id}" style="flex:1;text-align:center;padding:6px 8px;background:#0f172a;color:#fff;border-radius:8px;font-size:11px;text-decoration:none">Open product</a>
              <a href="${googleMapsNavigateUrl({ address: s.address, name: s.name, location: pos })}" target="_blank" rel="noopener" style="flex:1;text-align:center;padding:6px 8px;background:#3b82f6;color:#fff;border-radius:8px;font-size:11px;text-decoration:none">Navigate</a>
            </div>
          </div>`,
      });
      marker.addListener("click", () => info.open({ map, anchor: marker }));
      bounds.extend(pos);
    });

    if (!bounds.isEmpty() && listings.length > 0) {
      map.fitBounds(bounds, 60);
    }
  }, [ready, enrichVersion, product, userPoint]);

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-border/60 bg-background/70 px-5 py-3 backdrop-blur-2xl">
        <Link
          to="/product/$id"
          params={{ id: product.id }}
          className="flex size-9 items-center justify-center rounded-full border border-border bg-card active:scale-95"
        >
          <ChevronLeft className="size-4" />
        </Link>
        <div className="min-w-0">
          <p className="text-[10px] font-mono uppercase tracking-widest text-primary">
            Nearby stores
          </p>
          <h1 className="truncate font-display text-base font-bold">
            {product.brand} · {product.name}
          </h1>
        </div>
      </header>
      {err && (
        <div className="mx-auto max-w-lg px-5 py-6">
          <div className="rounded-3xl border border-border bg-card/40 p-6 text-center text-sm text-muted-foreground">
            Map unavailable: {err}
          </div>
        </div>
      )}
      <div ref={mapRef} className="h-[calc(100vh-56px)] w-full" />
    </div>
  );
}
