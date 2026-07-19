import { createFileRoute, Link } from "@tanstack/react-router";
import { Bell, ChevronRight } from "lucide-react";
import { BottomNav } from "@/components/BottomNav";
import { PRODUCTS, lowestPrice, bestStock } from "@/lib/products";
import { useAlerts, useAgeGate } from "@/lib/favorites";
import { AgeGate } from "@/components/AgeGate";

export const Route = createFileRoute("/alerts")({
  head: () => ({ meta: [{ title: "Alerts — NikFinder" }, { name: "description", content: "Stock and price drop alerts on NikFinder." }] }),
  component: Alerts,
});

function Alerts() {
  const { verified, confirm } = useAgeGate();
  const { ids } = useAlerts();
  const items = PRODUCTS.filter((p) => ids.includes(p.id));

  return (
    <div className="min-h-screen bg-background pb-28">
      {verified === false && <AgeGate onConfirm={confirm} />}
      <header className="mx-auto max-w-lg px-5 pt-[max(2rem,env(safe-area-inset-top))] pb-4">
        <p className="text-[10px] font-mono uppercase tracking-widest text-primary">We'll notify you</p>
        <h1 className="font-display text-3xl font-extrabold tracking-tight">Alerts</h1>
        <p className="mt-2 text-sm text-muted-foreground">Track price drops and back-in-stock updates for the products you follow.</p>
      </header>
      <main className="mx-auto max-w-lg px-5">
        {items.length === 0 ? (
          <div className="mt-8 rounded-3xl border border-border bg-card/40 p-10 text-center">
            <div className="mx-auto mb-4 grid size-14 place-items-center rounded-2xl bg-surface-elevated">
              <Bell className="size-5 text-muted-foreground" />
            </div>
            <h2 className="font-display text-lg font-bold">No alerts yet</h2>
            <p className="mt-2 text-sm text-muted-foreground">Open a product and tap "Notify me" to start tracking.</p>
            <Link to="/" className="mt-6 inline-flex rounded-2xl bg-primary px-5 py-3 text-xs font-semibold text-primary-foreground">
              Find products
            </Link>
          </div>
        ) : (
          <ul className="space-y-3">
            {items.map((p) => {
              const stock = bestStock(p);
              return (
                <li key={p.id}>
                  <Link
                    to="/product/$id"
                    params={{ id: p.id }}
                    className="flex items-center gap-4 rounded-3xl border border-border bg-card/50 p-3 transition-colors active:bg-card"
                  >
                    {p.image && <img src={p.image} alt={p.name} loading="lazy" width={80} height={80} className="size-16 shrink-0 rounded-2xl object-cover" />}
                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] font-mono uppercase tracking-widest text-primary">{p.brand}</p>
                      <p className="truncate text-sm font-semibold">{p.name}</p>
                      <p className="mt-0.5 text-[11px] text-muted-foreground">
                        {stock === "out" ? "Waiting for restock" : `From ${lowestPrice(p).toFixed(2)} SEK nearby`}
                      </p>
                    </div>
                    <ChevronRight className="size-4 text-muted-foreground" />
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </main>
      <BottomNav />
    </div>
  );
}
