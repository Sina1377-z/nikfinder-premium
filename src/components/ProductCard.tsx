import { Link } from "@tanstack/react-router";
import { Heart } from "lucide-react";
import type { Product } from "@/lib/catalog/types";
import { bestStock, lowestPrice, nearestKm } from "@/lib/products";
import { useFavorites } from "@/lib/favorites";

const stockLabel: Record<string, string> = {
  high: "In stock",
  low: "Low stock",
  out: "Out of stock",
};

export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const { isFav, toggle } = useFavorites();
  const fav = isFav(product.id);
  const price = lowestPrice(product);
  const km = nearestKm(product);
  const stock = bestStock(product);

  return (
    <Link
      to="/product/$id"
      params={{ id: product.id }}
      className="group block animate-fade-up"
      style={{ animationDelay: `${Math.min(index, 6) * 60}ms` }}
    >
      <div className="relative overflow-hidden rounded-3xl bg-card ring-1 ring-border transition-transform active:scale-[0.98]">
        <div className="relative aspect-square w-full overflow-hidden bg-white">
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            width={800}
            height={800}
            className="h-full w-full object-contain p-6 transition-transform duration-700 group-hover:scale-105"
          />
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggle(product.id);
            }}
            aria-label={fav ? "Remove from favorites" : "Add to favorites"}
            className="absolute right-3 top-3 flex size-9 items-center justify-center rounded-full border border-black/10 bg-white/80 backdrop-blur-md transition-transform active:scale-90"
          >
            <Heart
              className={`size-4 transition-colors ${fav ? "fill-primary text-primary" : "text-black/60"}`}
              strokeWidth={2}
            />
          </button>
          <div className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-full border border-black/10 bg-white/85 px-2.5 py-1 backdrop-blur-md">
            <span
              className={`size-1.5 rounded-full ${
                stock === "high"
                  ? "bg-primary"
                  : stock === "low"
                    ? "bg-yellow-500"
                    : "bg-neutral-400"
              }`}
            />
            <span className="text-[10px] font-medium uppercase tracking-wider text-black/80">
              {stockLabel[stock]}
            </span>
          </div>
        </div>
      </div>
      <div className="mt-3 flex items-start justify-between gap-3 px-1">
        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-primary">
            {product.brand}
          </p>
          <h3 className="truncate font-display text-base font-bold">{product.name}</h3>
          <p className="truncate text-xs text-muted-foreground">
            {product.flavor} · {product.strength}
          </p>
        </div>
        <div className="shrink-0 text-right">
          <p className="font-mono text-sm font-bold text-primary">
            {price.toFixed(2)} <span className="text-[10px] text-muted-foreground">SEK</span>
          </p>
          <p className="mt-0.5 text-[10px] uppercase tracking-wider text-muted-foreground">
            {km.toFixed(1)} km away
          </p>
        </div>
      </div>
    </Link>
  );
}
