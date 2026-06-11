import { X, Check } from "lucide-react";

const before = [
  "Contradictory advice from doctors, influencers, and Google",
  "No clear connection between your symptoms and insulin",
  "Overwhelming research papers written for specialists",
  "Generic diet tips that ignore your specific condition",
  "Feeling dismissed — 'your labs are normal'",
];

const after = [
  "One place: clear, cited explanations written for you",
  "Understand exactly how insulin drives PCOS, NAFLD & prediabetes",
  "Science translated into plain language — no medical degree needed",
  "Condition-specific guides: PCOS, prediabetes, NAFLD, metabolic syndrome",
  "A metabolic profile that explains what your numbers actually mean",
];

export function BeforeAfterSection() {
  return (
    <section className="py-20 md:py-28 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        <div className="text-center mb-14">
          <p className="text-forest-600 font-semibold uppercase tracking-widest text-sm mb-3">
            The problem we solve
          </p>
          <h2 className="text-4xl md:text-5xl font-extrabold text-foreground">
            When scattered information{" "}
            <br className="hidden sm:block" />
            hides the full picture
          </h2>
          <p className="mt-4 text-xl text-muted-foreground max-w-2xl mx-auto">
            Most people with insulin resistance spend years confused — not because the
            science is unclear, but because no one has translated it clearly.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">

          {/* Before */}
          <div className="rounded-3xl border border-red-100 bg-red-50/40 p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                <X className="h-4 w-4 text-red-500" />
              </div>
              <h3 className="text-lg font-bold text-foreground">Before InsulinIQ</h3>
            </div>
            <ul className="space-y-4">
              {before.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <div className="mt-0.5 w-5 h-5 rounded-full bg-red-100 flex-shrink-0 flex items-center justify-center">
                    <X className="h-3 w-3 text-red-400" />
                  </div>
                  <span className="text-sm text-foreground/70 leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* After */}
          <div className="rounded-3xl border border-forest-200 bg-forest-50/60 p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-full bg-forest-100 flex items-center justify-center">
                <Check className="h-4 w-4 text-forest-600" />
              </div>
              <h3 className="text-lg font-bold text-foreground">With InsulinIQ</h3>
            </div>
            <ul className="space-y-4">
              {after.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <div className="mt-0.5 w-5 h-5 rounded-full bg-forest-100 flex-shrink-0 flex items-center justify-center">
                    <Check className="h-3 w-3 text-forest-600" />
                  </div>
                  <span className="text-sm text-foreground/75 leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>
      </div>
    </section>
  );
}
