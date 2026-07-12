import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ChevronLeft, Heart, Bell, Navigation, Store as StoreIcon } from "lucide-react";
import { BottomNav } from "@/components/BottomNav";
import { PRODUCTS, STORES, lowestPrice } from "@/lib/products";
import { useAgeGate, useAlerts, useFavorites } from "@/lib/favorites";
import { AgeGate } from "@/components/AgeGate";

export const Route = createFileRoute("/product/$id")({
  loader: ({ params }) => {
    const product = PRODUCTS.find((p) => p.id === params.id);
    if (!product) throw notFound();
    return { product };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.product.name} — NikFinder` },
          { name: "description", content: `${loaderData.product.brand} · ${loaderData.product.flavor}. Compare prices and stock nearby.` },
        ]
      : [{ title: "Product — NikFinder" }],
  }),
  component: ProductPage,
  notFoundComponent: () => (
    <div className="flex min-h-screen items-center justify-center px-6 text-center">
      <div>
        <h1 className="font-display text-2xl font-bold">Product not found</h1>
        <Link to="/" className="mt-4 inline-block text-primary">Back home</Link>
      </div>
    </div>
  ),
});

const stockCopy: Record<"high" | "low" | "out", string> = { high: "In stock", low: "Low stock", out: "Out of stock" };

function ProductPage() {
  const { product } = Route.useLoaderData();
  const { verified, confirm } = useAgeGate();
  const { isFav, toggle } = useFavorites();
  const { has, toggle: toggleAlert } = useAlerts();

  const sorted = [...product.listings].sort((a, b) => a.price - b.price);
  const best = sorted[0];
  const cheapest = lowestPrice(product);
  const fav = isFav(product.id);
  const alertOn = has(product.id);

  return (
    <div className="min-h-screen bg-background pb-32">
      {verified === false && <AgeGate onConfirm={confirm} />}

      <div className="relative">
        <div className="relative aspect-square w-full overflow-hidden bg-surface-elevated">
          <img
            src={product.image}
            alt={product.name}
            width={800}
            height={800}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-transparent to-background" />
        </div>

        <Link
          to="/"
          className="absolute left-5 top-[max(1.25rem,env(safe-area-inset-top))] flex size-11 items-center justify-center rounded-full border border-white/10 bg-black/40 backdrop-blur-xl active:scale-95 transition-transform"
        >
          <ChevronLeft className="size-5" />
        </Link>
        <button
          onClick={() => toggle(product.id)}
          className="absolute right-5 top-[max(1.25rem,env(safe-area-inset-top))] flex size-11 items-center justify-center rounded-full border border-white/10 bg-black/40 backdrop-blur-xl active:scale-95 transition-transform"
          aria-label="Toggle favorite"
        >
          <Heart className={`size-5 ${fav ? "fill-primary text-primary" : "text-white"}`} />
        </button>
      </div>

      <main className="relative z-10 mx-auto -mt-16 max-w-lg px-5 space-y-8">
        <section className="animate-fade-up">
          <p className="text-[10px] font-mono uppercase tracking-widest text-primary">{product.brand}</p>
          <h1 className="mt-1 font-display text-3xl font-extrabold tracking-tight">{product.name}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{product.flavor} · {product.format}</p>

          <div className="mt-5 flex gap-3 overflow-x-auto no-scrollbar">
            <Stat label="Strength" value={product.strength} />
            <Stat label="Nicotine" value={`${product.strengthMg} mg`} />
            {product.pouches && <Stat label="Pouches" value={`${product.pouches} pcs`} />}
            {product.puffs && <Stat label="Puffs" value={`~${product.puffs}`} />}
            <Stat label="Format" value={product.format} />
          </div>
        </section>

        <section className="animate-fade-up rounded-3xl border border-border bg-card/50 p-5">
          <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">Lowest nearby</p>
          <div className="mt-1 flex items-baseline justify-between">
            <p className="font-display text-4xl font-extrabold text-primary">
              {cheapest.toFixed(2)}
              <span className="ml-1 text-sm font-mono text-muted-foreground">SEK</span>
            </p>
            <p className="text-xs text-muted-foreground">at {STORES[best.storeId].name}</p>
          </div>
        </section>

        <section className="animate-fade-up space-y-3">
          <h2 className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
            Nearby availability
          </h2>
          {sorted.map((l, i) => {
            const store = STORES[l.storeId];
            const isBest = i === 0 && l.stock !== "out";
            const isOut = l.stock === "out";
            return (
              <div
                key={l.storeId}
                className={`rounded-3xl border p-4 transition-colors ${
                  isBest
                    ? "border-primary/30 bg-primary/5 ring-1 ring-primary/20"
                    : "border-border bg-card/40"
                } ${isOut ? "opacity-60" : ""}`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="grid size-10 shrink-0 place-items-center rounded-2xl bg-surface-elevated">
                      <StoreIcon className="size-4 text-muted-foreground" />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold">{store.name}</p>
                      <p className="truncate text-[11px] text-muted-foreground">
                        {store.hours} · {l.distanceKm.toFixed(1)} km
                      </p>
                    </div>
                  </div>
                  <div className="shrink-0 text-right">
                    {isBest && (
                      <span className="mb-1 inline-block rounded-full bg-primary/20 px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wider text-primary">
                        Best Price
                      </span>
                    )}
                    <p className={`font-mono text-sm font-bold ${isBest ? "text-primary" : ""}`}>
                      {l.price.toFixed(2)}
                    </p>
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                      {stockCopy[l.stock]}
                    </p>
                  </div>
                </div>
                {!isOut && (
                  <div className="mt-3 flex gap-2">
                    <button className="flex-1 rounded-xl border border-border bg-background/60 py-2 text-xs font-medium text-foreground/80 transition-colors hover:text-foreground">
                      Opening hours
                    </button>
                    <button className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-foreground py-2 text-xs font-semibold text-background transition-transform active:scale-95">
                      <Navigation className="size-3.5" />
                      Navigate
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </section>

        <section className="animate-fade-up space-y-3">
          <h2 className="text-xs font-mono uppercase tracking-widest text-muted-foreground">About</h2>
          <p className="text-sm leading-relaxed text-foreground/85">{product.description}</p>
          <div className="rounded-2xl border border-border bg-card/40 p-4">
            <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">Ingredients</p>
            <p className="mt-1 text-xs leading-relaxed text-foreground/80">{product.ingredients}</p>
          </div>
        </section>

        <div className="sticky bottom-24 z-20 pt-2">
          <button
            onClick={() => toggleAlert(product.id)}
            className={`flex w-full items-center justify-center gap-2 rounded-3xl py-5 text-sm font-bold shadow-lg transition-transform active:scale-[0.98] ${
              alertOn
                ? "border border-primary/30 bg-primary/10 text-primary shadow-primary/10"
                : "bg-primary text-primary-foreground shadow-primary/20"
            }`}
          >
            <Bell className={`size-4 ${alertOn ? "fill-primary" : ""}`} />
            {alertOn ? "Alerts on — we'll notify you" : "Notify me on price drops & restock"}
          </button>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-[110px] rounded-2xl border border-border bg-card/50 px-4 py-3">
      <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">{label}</p>
      <p className="mt-0.5 text-sm font-semibold">{value}</p>
    </div>
  );
}
