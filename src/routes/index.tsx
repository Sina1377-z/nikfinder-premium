import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, SlidersHorizontal, MapPin } from "lucide-react";
import { AgeGate } from "@/components/AgeGate";
import { BottomNav } from "@/components/BottomNav";
import { ProductCard } from "@/components/ProductCard";
import { CategoryTabs } from "@/components/CategoryTabs";
import { PRODUCTS, type Category } from "@/lib/products";
import { usePrimatSearch } from "@/lib/usePrimatSearch";
import { useAgeGate } from "@/lib/favorites";

export const Route = createFileRoute("/")({
  component: Home,
});

type SortKey = "distance" | "price-asc" | "price-desc" | "strength";

function Home() {
  const { verified, confirm } = useAgeGate();
  const [category, setCategory] = useState<Category | "all">("all");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortKey>("distance");
  const [showFilters, setShowFilters] = useState(false);

  const results = useMemo(() => {
    let list = PRODUCTS;
    if (category !== "all") list = list.filter((p) => p.category === category);
    if (query.trim()) list = smartSearch(list, query);
    const arr = [...list];
    if (sort === "price-asc")
      arr.sort((a, b) => Math.min(...a.listings.map((l) => l.price)) - Math.min(...b.listings.map((l) => l.price)));
    if (sort === "price-desc")
      arr.sort((a, b) => Math.min(...b.listings.map((l) => l.price)) - Math.min(...a.listings.map((l) => l.price)));
    if (sort === "distance")
      arr.sort((a, b) => Math.min(...a.listings.map((l) => l.distanceKm)) - Math.min(...b.listings.map((l) => l.distanceKm)));
    if (sort === "strength") arr.sort((a, b) => b.strengthMg - a.strengthMg);
    return arr;
  }, [category, query, sort]);

  return (
    <div className="min-h-screen bg-background pb-28">
      {verified === false && <AgeGate onConfirm={confirm} />}

      <header className="sticky top-0 z-30 border-b border-border/60 bg-background/70 backdrop-blur-2xl">
        <div className="mx-auto max-w-lg px-5 pt-[max(1.5rem,env(safe-area-inset-top))] pb-4">
          <div className="mb-5 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <span className="size-2.5 rounded-full bg-primary shadow-[0_0_12px] shadow-primary/60" />
              <h1 className="font-display text-xl font-extrabold tracking-tight">NikFinder</h1>
            </Link>
            <div className="flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-[11px] text-muted-foreground">
              <MapPin className="size-3.5 text-primary" strokeWidth={2.5} />
              Stockholm
            </div>
          </div>

          <div className="relative mb-4">
            <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search brand, flavor or type…"
              className="w-full rounded-2xl border border-border bg-card py-3.5 pl-11 pr-12 text-sm placeholder:text-muted-foreground focus:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
            <button
              onClick={() => setShowFilters((v) => !v)}
              aria-label="Filters"
              className={`absolute right-2 top-1/2 flex size-9 -translate-y-1/2 items-center justify-center rounded-xl transition-colors ${
                showFilters ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <SlidersHorizontal className="size-4" />
            </button>
          </div>

          <CategoryTabs value={category} onChange={setCategory} />

          {showFilters && (
            <div className="mt-4 flex flex-wrap gap-2 animate-fade-up">
              {(
                [
                  ["distance", "Nearby"],
                  ["price-asc", "Lowest price"],
                  ["price-desc", "Highest price"],
                  ["strength", "Strongest"],
                ] as const
              ).map(([k, label]) => (
                <button
                  key={k}
                  onClick={() => setSort(k)}
                  className={`rounded-full px-4 py-1.5 text-xs font-medium transition-colors ${
                    sort === k
                      ? "bg-primary text-primary-foreground"
                      : "border border-border bg-card text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          )}
        </div>
      </header>

      <main className="mx-auto max-w-lg px-5 pt-6">
        <div className="mb-4 flex items-baseline justify-between">
          <div>
            <p className="text-[10px] font-mono uppercase tracking-widest text-primary">Nearby now</p>
            <h2 className="font-display text-2xl font-bold">
              {query ? "Results" : "Available around you"}
            </h2>
          </div>
          <span className="font-mono text-xs text-muted-foreground">{results.length} items</span>
        </div>

        {results.length === 0 ? (
          <div className="rounded-3xl border border-border bg-card/40 p-10 text-center">
            <p className="text-sm text-muted-foreground">No products match "{query}".</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {results.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
}
