interface Stat {
  value: string;
  label: string;
  source?: string;
  color?: "sage" | "clay" | "honey" | "forest";
}

interface StatGridProps {
  stats: Stat[];
}

const COLOR = {
  sage: {
    bg:     "bg-sage-50",
    border: "border-sage-200",
    value:  "text-sage-700",
    bar:    "bg-sage-400",
    source: "text-sage-500/70",
  },
  clay: {
    bg:     "bg-clay-50",
    border: "border-clay-200",
    value:  "text-clay-700",
    bar:    "bg-clay-400",
    source: "text-clay-500/70",
  },
  honey: {
    bg:     "bg-honey-50",
    border: "border-honey-200",
    value:  "text-honey-700",
    bar:    "bg-honey-400",
    source: "text-honey-500/70",
  },
  forest: {
    bg:     "bg-forest-50",
    border: "border-forest-200",
    value:  "text-forest-700",
    bar:    "bg-forest-400",
    source: "text-forest-500/70",
  },
} as const;

export function StatGrid({ stats }: StatGridProps) {
  return (
    <div className="my-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
      {stats.map((stat, i) => {
        const c = COLOR[stat.color ?? "forest"];
        return (
          <div
            key={i}
            className={`relative overflow-hidden rounded-2xl border p-6 ${c.bg} ${c.border}`}
          >
            {/* Decorative arc */}
            <div
              className={`absolute -right-6 -top-6 h-20 w-20 rounded-full opacity-10 ${c.bar}`}
              aria-hidden
            />
            <p className={`text-4xl font-extrabold tracking-tight ${c.value}`}>
              {stat.value}
            </p>
            <p className="mt-2 text-sm font-medium leading-snug text-foreground/75">
              {stat.label}
            </p>
            {stat.source && (
              <p className={`mt-3 text-xs ${c.source}`}>{stat.source}</p>
            )}
          </div>
        );
      })}
    </div>
  );
}
