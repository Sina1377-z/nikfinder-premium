export function AgeGate({ onConfirm }: { onConfirm: () => void }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background px-6 animate-fade-in">
      <div className="pointer-events-none absolute inset-0 opacity-40">
        <div
          className="absolute -top-40 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full blur-3xl"
          style={{ background: "radial-gradient(circle, oklch(0.78 0.19 148 / 0.25), transparent 65%)" }}
        />
      </div>

      <div className="relative w-full max-w-sm animate-scale-in">
        <div className="rounded-[2.5rem] border border-border bg-card/60 p-8 backdrop-blur-2xl text-center shadow-2xl">
          <div className="mx-auto mb-8 flex size-24 items-center justify-center rounded-full border-2 border-primary/60 bg-primary/10">
            <span className="font-display text-3xl font-extrabold tracking-tight text-primary">18+</span>
          </div>
          <h1 className="font-display text-3xl font-extrabold tracking-tight">Verify your age</h1>
          <p className="mx-auto mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground text-pretty">
            NikFinder is intended only for users aged 18 years or older.
          </p>
          <button
            onClick={onConfirm}
            className="mt-10 w-full rounded-2xl bg-foreground py-4 text-sm font-semibold text-background transition-transform active:scale-[0.98]"
          >
            I am 18 or older
          </button>
          <p className="mt-4 text-xs text-muted-foreground">
            By continuing you confirm your age. This site is for information and price comparison only.
          </p>
        </div>
      </div>
    </div>
  );
}
