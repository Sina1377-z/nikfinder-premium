import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart } from "lucide-react";
import { BottomNav } from "@/components/BottomNav";
import { ProductCard } from "@/components/ProductCard";
import { PRODUCTS } from "@/lib/products";
import { useFavorites, useAgeGate } from "@/lib/favorites";
import { AgeGate } from "@/components/AgeGate";

export const Route = createFileRoute("/favorites")({
  head: () => ({ meta: [{ title: "Favorites — NikFinder" }, { name: "description", content: "Your saved nicotine products on NikFinder." }] }),
  component: Favorites,
});

function Favorites() {
  const { verified, confirm } = useAgeGate();
  const { ids } = useFavorites();
  const items = PRODUCTS.filter((p) => ids.includes(p.id));

  return (
    <div className="min-h-screen bg-background pb-28">
      {verified === false && <AgeGate onConfirm={confirm} />}
      <header className="mx-auto max-w-lg px-5 pt-[max(2rem,env(safe-area-inset-top))] pb-4">
        <p className="text-[10px] font-mono uppercase tracking-widest text-primary">Your list</p>
        <h1 className="font-display text-3xl font-extrabold tracking-tight">Favorites</h1>
      </header>
      <main className="mx-auto max-w-lg px-5">
        {items.length === 0 ? (
          <div className="mt-8 rounded-3xl border border-border bg-card/40 p-10 text-center">
            <div className="mx-auto mb-4 grid size-14 place-items-center rounded-2xl bg-surface-elevated">
              <Heart className="size-5 text-muted-foreground" />
            </div>
            <h2 className="font-display text-lg font-bold">No favorites yet</h2>
            <p className="mt-2 text-sm text-muted-foreground">Tap the heart on a product to save it here.</p>
            <Link to="/" className="mt-6 inline-flex rounded-2xl bg-primary px-5 py-3 text-xs font-semibold text-primary-foreground">
              Browse products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {items.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
          </div>
        )}
      </main>
      <BottomNav />
    </div>
  );
}
