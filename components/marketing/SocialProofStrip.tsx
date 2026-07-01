const signals = [
  { label: "New England Journal of Medicine", abbr: "NEJM" },
  { label: "The Lancet", abbr: "Lancet" },
  { label: "Nature Metabolism", abbr: "Nature" },
  { label: "Diabetes Care", abbr: "Diabetes Care" },
  { label: "Journal of Clinical Endocrinology", abbr: "JCEM" },
];

export function SocialProofStrip() {
  return (
    <section className="border-y border-border bg-secondary/30 py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="text-center text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-6">
          Our educational content draws on peer-reviewed research including
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
          {signals.map((s) => (
            <div
              key={s.abbr}
              className="flex items-center gap-2 opacity-50 hover:opacity-80 transition-opacity"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-forest-500" />
              <span className="text-sm font-semibold text-foreground/70 tracking-tight">
                {s.abbr}
              </span>
              <span className="hidden sm:inline text-xs text-muted-foreground">
                · {s.label}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <span className="text-forest-500 font-bold">Evidence-based</span> articles
          </span>
          <span className="text-border">|</span>
          <span className="flex items-center gap-1.5">
            <span className="text-forest-500 font-bold">3</span> markets — US · UK · Australia
          </span>
        </div>
      </div>
    </section>
  );
}
