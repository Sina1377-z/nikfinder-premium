import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search as SearchIcon } from "lucide-react";
import { BottomNav } from "@/components/BottomNav";
import { ProductCard } from "@/components/ProductCard";
import { PRODUCTS, smartSearch } from "@/lib/products";
import { useAgeGate } from "@/lib/favorites";
import { AgeGate } from "@/components/AgeGate";

export const Route = createFileRoute("/search")({
  head: () => ({ meta: [{ title: "Search — NikFinder" }, { name: "description", content: "Smart search across all nicotine products." }] }),
  component: SearchPage,
});

const SUGGESTIONS = ["Mint", "XQS", "Cool Mint", "Berry", "Citrus", "Extra Strong"];

function SearchPage() {
  const { verified, confirm } = useAgeGate();
  const [q, setQ] = useState("");
  const results = useMemo(() => (q.trim() ? smartSearch(PRODUCTS, q) : []), [q]);

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
            placeholder='Try "mint", "XQS mint" or "berry vape"'
            className="w-full rounded-2xl border border-border bg-card py-3.5 pl-11 pr-4 text-sm placeholder:text-muted-foreground focus:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
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
      </header>
      <main className="mx-auto max-w-lg px-5">
        {q && results.length === 0 && (
          <div className="rounded-3xl border border-border bg-card/40 p-10 text-center">
            <p className="text-sm text-muted-foreground">No matches for "{q}".</p>
          </div>
        )}
        {results.length > 0 && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {results.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
          </div>
        )}
      </main>
      <BottomNav />
    </div>
  );
}
