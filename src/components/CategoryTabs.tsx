import type { Category } from "@/lib/products";

const TABS: { id: Category | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "snus", label: "Pouches" },
  { id: "vape-disposable", label: "Disposable" },
  { id: "vape-refillable", label: "Refillable" },
  { id: "cigarettes", label: "Cigarettes" },
];

export function CategoryTabs({
  value,
  onChange,
}: {
  value: Category | "all";
  onChange: (v: Category | "all") => void;
}) {
  return (
    <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
      {TABS.map((t) => {
        const active = value === t.id;
        return (
          <button
            key={t.id}
            onClick={() => onChange(t.id)}
            className={`whitespace-nowrap rounded-full px-5 py-2 text-xs font-semibold transition-colors ${
              active
                ? "bg-foreground text-background"
                : "border border-border bg-card text-foreground/80 hover:text-foreground"
            }`}
          >
            {t.label}
          </button>
        );
      })}
    </div>
  );
}
