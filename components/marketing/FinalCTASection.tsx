import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function FinalCTASection() {
  return (
    <section className="py-24 md:py-32 bg-forest-950 relative overflow-hidden">
      {/* Background texture */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-forest-800/30 via-transparent to-transparent"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 h-px w-64 bg-gradient-to-r from-transparent via-forest-500/50 to-transparent"
      />

      <div className="relative mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">

        <p className="text-forest-400 font-semibold uppercase tracking-widest text-xs mb-5">
          Start today — it&apos;s free
        </p>

        <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight">
          Understand your metabolic health in{" "}
          <span className="text-forest-400">10 minutes</span>
        </h2>

        <p className="mt-6 text-lg md:text-xl text-forest-300 max-w-xl mx-auto leading-relaxed">
          Take the free quiz and get a personalised profile explaining exactly
          how insulin resistance affects your specific symptoms.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="#quiz"
            className="group inline-flex items-center gap-2 rounded-full bg-forest-500 hover:bg-forest-400 text-white font-bold px-8 py-4 text-base transition-all duration-200 shadow-lg shadow-forest-900/50 hover:shadow-forest-500/30"
          >
            Take the free quiz
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
          <Link
            href="/learn"
            className="inline-flex items-center gap-2 rounded-full border border-forest-700 hover:border-forest-500 text-forest-300 hover:text-white font-semibold px-8 py-4 text-base transition-all duration-200"
          >
            Browse articles
          </Link>
        </div>

        <p className="mt-6 text-xs text-forest-600">
          No sign-up required · Evidence-based · Built for the UK, US & Australia
        </p>

      </div>
    </section>
  );
}
