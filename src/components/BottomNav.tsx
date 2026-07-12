import { Link, useRouterState } from "@tanstack/react-router";
import { Home, Search, Heart, Bell } from "lucide-react";

const items = [
  { to: "/", label: "Home", icon: Home },
  { to: "/search", label: "Search", icon: Search },
  { to: "/favorites", label: "Saved", icon: Heart },
  { to: "/alerts", label: "Alerts", icon: Bell },
] as const;

export function BottomNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/80 backdrop-blur-2xl">
      <div className="mx-auto flex max-w-lg items-center justify-around px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2">
        {items.map(({ to, label, icon: Icon }) => {
          const active = pathname === to;
          return (
            <Link
              key={to}
              to={to}
              className="flex flex-1 flex-col items-center gap-1 rounded-2xl px-3 py-2 transition-colors"
            >
              <Icon
                className={`size-5 transition-colors ${active ? "text-primary" : "text-muted-foreground"}`}
                strokeWidth={2}
              />
              <span
                className={`text-[10px] font-medium tracking-wide ${active ? "text-foreground" : "text-muted-foreground"}`}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
