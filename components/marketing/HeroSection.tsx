import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, CheckCircle } from "lucide-react";

const benefits = [
  "Evidence-based insulin resistance education",
  "Personalized metabolic profile quiz",
  "PCOS, NAFLD & prediabetes resources",
  "Low-glycemic recipes and meal plans",
];

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-forest-50 via-background to-sage-50 py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <Badge className="mb-4 bg-forest-100 text-forest-700 border-forest-200 hover:bg-forest-100">
            Science-backed metabolic health education
          </Badge>

          <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl md:text-6xl">
            Understand your{" "}
            <span className="text-forest-600">insulin resistance</span>{" "}
            and take control
          </h1>

          <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
            Trusted education on PCOS, prediabetes, NAFLD, and metabolic
            syndrome — backed by research, made simple. Start with a free quiz
            to discover your metabolic profile.
          </p>

          <ul className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3 text-left max-w-xl mx-auto">
            {benefits.map((b) => (
              <li key={b} className="flex items-start gap-2 text-sm text-foreground/80">
                <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-forest-500" />
                {b}
              </li>
            ))}
          </ul>

          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-forest-600 hover:bg-forest-700 text-white px-8"
              asChild
            >
              <Link href="/quiz">
                Take the Free Quiz
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/learn">Browse Articles</Link>
            </Button>
          </div>

          <p className="mt-4 text-xs text-muted-foreground">
            No credit card required. Educational content only — not medical advice.
          </p>
        </div>
      </div>

      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 -right-24 h-96 w-96 rounded-full bg-forest-100 opacity-40 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-sage-100 opacity-40 blur-3xl"
      />
    </section>
  );
}
