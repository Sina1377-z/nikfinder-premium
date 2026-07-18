import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search as SearchIcon, Tag, Package, Store } from "lucide-react";
import { BottomNav } from "@/components/BottomNav";
import { ProductCard } from "@/components/ProductCard";
import {
  autocomplete,
  relatedSuggestions,
} from "@/lib/products";
import { usePrimatSearch } from "@/lib/usePrimatSearch";
import { useAgeGate } from "@/lib/favorites";
import { AgeGate } from "@/components/AgeGate";

export const Route = createFileRoute("/search")({
  head: () => ({
    meta: [
      { title: "Search — NikFinder" },
      { name: "description", content: "Smart search across all nicotine products by brand, flavor, type or strength." },
    ],
  }),
  component: SearchPage,
});

const SUGGESTIONS = [
  "Mint",
  "ZYN",
  "VELO",
  "Cool Mint",
  "Berry",
  "Citrus",
  "Extra Strong",
  "Elf Bar",
  "Loop",
];

const KIND_ICON = {
  brand: Store,
  flavor: Tag,
  product: Package,
};

function SearchPage() {
  const { verified, confirm } = useAgeGate();
  const [q, setQ] = useState("");
  const [focused, setFocused] = useState(false);

  const results = useMemo(() => (q.trim() ? smartSearch(PRODUCTS, q) : []), [q]);
  const suggestions = useMemo(() => autocomplete(q, 6), [q]);
  const related = useMemo(() => (q.trim() ? relatedSuggestions(q, 6) : []), [q]);

  const showAutocomplete = focused && q.trim().length > 0 && suggestions.length > 0;

  return (
    <div className="min-h-screen bg-background pb-28">
      {verified === false && <AgeGate onConfirm={confirm} />}
      <header className="mx-auto max-w-lg px-5 pt-[max(2rem,env(safe-area-inset-top))] pb-4">
        <p className="text-[10px] font-mono uppercase tracking-widest text-primary">Smart search</p>
        <h1 className="mb-5 font-display text-3xl font-extrabold tracking-tight">What are you after?</h1>
        <div className="relative">
          <SearchIcon className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setTimeout(() => setFocused(false), 150)}
            placeholder='Try "ZYN mint", "berry disposable" or "Ettan"'
            className="w-full rounded-2xl border border-border bg-card py-3.5 pl-11 pr-4 text-sm placeholder:text-muted-foreground focus:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
          {showAutocomplete && (
            <div className="absolute inset-x-0 top-full z-20 mt-2 overflow-hidden rounded-2xl border border-border bg-card/95 backdrop-blur-xl shadow-2xl animate-fade-up">
              {suggestions.map((s) => {
                const Icon = KIND_ICON[s.kind];
                return (
                  <button
                    key={`${s.kind}-${s.label}`}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      setQ(s.label);
                      setFocused(false);
                    }}
                    className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm hover:bg-surface-elevated"
                  >
                    <Icon className="size-4 text-muted-foreground" />
                    <span className="flex-1 truncate">{s.label}</span>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                      {s.kind}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
        {!q && (
          <div className="mt-5">
            <p className="mb-2 text-[10px] font-mono uppercase tracking-widest text-muted-foreground">Trending</p>
            <div className="flex flex-wrap gap-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => setQ(s)}
                  className="rounded-full border border-border bg-card px-4 py-1.5 text-xs font-medium text-foreground/80 hover:text-foreground"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}
        {q && related.length > 0 && (
          <div className="mt-5">
            <p className="mb-2 text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
              Related searches
            </p>
            <div className="flex flex-wrap gap-2">
              {related.map((s) => (
                <button
                  key={s}
                  onClick={() => setQ(s)}
                  className="rounded-full border border-border bg-card px-4 py-1.5 text-xs font-medium text-foreground/80 hover:text-foreground"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}
      </header>
      <main className="mx-auto max-w-lg px-5">
        {q && results.length === 0 && (
          <div className="rounded-3xl border border-border bg-card/40 p-10 text-center">
            <p className="text-sm text-muted-foreground">No matches for "{q}".</p>
          </div>
        )}
        {results.length > 0 && (
          <>
            <p className="mb-4 font-mono text-xs text-muted-foreground">{results.length} results</p>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {results.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
            </div>
          </>
        )}
      </main>
      <BottomNav />
    </div>
  );
}
