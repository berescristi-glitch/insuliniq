import Link from "next/link";
import { Sparkles, Clock, ArrowRight } from "lucide-react";

const badges = [
  { icon: Clock, text: "8 questions · 3 minutes" },
  { icon: Sparkles, text: "Instant personalised results" },
];

const profiles = [
  { label: "PCOS Metabolic Support", color: "bg-sage-100 text-sage-700" },
  { label: "Blood Sugar Stabiliser", color: "bg-clay-100 text-clay-700" },
  { label: "Liver Metabolic Focus", color: "bg-honey-100 text-honey-700" },
  { label: "Metabolic Syndrome Focus", color: "bg-forest-100 text-forest-700" },
];

export function QuizCTASection() {
  return (
    <section id="quiz" className="py-20 md:py-28 bg-background relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-br from-forest-50/60 via-transparent to-sage-50/40"
      />

      <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-forest-100 border border-forest-200 px-4 py-1.5 text-sm font-medium text-forest-700 mb-6">
            <span className="text-base">🎯</span>
            Free Metabolic Quiz
          </div>

          <h2 className="text-4xl md:text-5xl font-extrabold text-foreground">
            What&apos;s your{" "}
            <span className="text-forest-600">metabolic profile?</span>
          </h2>
          <p className="mt-4 text-xl text-muted-foreground max-w-xl mx-auto">
            8 questions. Personalised recipe recommendations matched to your
            region, symptoms, and lifestyle.
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
            {badges.map(({ icon: Icon, text }) => (
              <div
                key={text}
                className="flex items-center gap-1.5 text-sm text-muted-foreground"
              >
                <Icon className="h-4 w-4 text-forest-500" />
                {text}
              </div>
            ))}
          </div>
        </div>

        {/* Card */}
        <div className="relative">
          <div
            aria-hidden
            className="absolute inset-x-4 -bottom-2 h-full rounded-3xl bg-forest-100/60 blur-md -z-10"
          />
          <div className="relative bg-white border border-forest-100 rounded-3xl shadow-xl overflow-hidden">
            <div className="h-1.5 w-full bg-gradient-to-r from-forest-400 via-sage-400 to-honey-400" />
            <div className="p-8 md:p-12 flex flex-col items-center gap-8">

              {/* Profile preview chips */}
              <div className="flex flex-wrap justify-center gap-2">
                {profiles.map((p) => (
                  <span
                    key={p.label}
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${p.color}`}
                  >
                    {p.label}
                  </span>
                ))}
              </div>

              <div className="text-center space-y-2 max-w-md">
                <p className="text-base text-muted-foreground">
                  Tell us your goal, region, symptoms, and food preferences — we&apos;ll
                  match you to the right articles and recipe plan.
                </p>
              </div>

              <Link
                href="/quiz"
                className="inline-flex items-center gap-2 rounded-xl bg-forest-600 hover:bg-forest-700 px-8 py-4 text-base font-semibold text-white shadow-lg shadow-forest-600/20 transition-all hover:-translate-y-0.5 hover:shadow-forest-600/30"
              >
                Take the Free Quiz
                <ArrowRight className="h-5 w-5" />
              </Link>

              <p className="text-xs text-muted-foreground/70">
                Results can be viewed without creating an account.
              </p>
            </div>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          For educational purposes only. Does not constitute medical advice.
        </p>
      </div>
    </section>
  );
}
