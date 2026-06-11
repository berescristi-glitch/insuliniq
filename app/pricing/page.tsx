// Pricing page — Server Component.
// Three-option model: Starter Kit tripwire + Core Monthly + Core Annual.
// CheckoutButton is a Client Component leaf; everything else is static markup.

import Link from "next/link";
import { Check } from "lucide-react";
import { CheckoutButton } from "@/components/pricing/CheckoutButton";
import type { PlanId } from "@/lib/lemon-squeezy/checkout";

const starterKitFeatures = [
  "Insulin Resistance Science Guide (PDF)",
  "Post-Quiz Metabolic Profile Report",
  "7-Day Glycemic Control Meal Template",
  "Hidden Sugars Grocery Guide (PDF)",
];

const coreFeatures = [
  "300+ peer-reviewed educational guides",
  "Interactive Glycemic Response Meal Builder",
  "Lab value tracking & HOMA-IR calculators",
  "Monthly live Q&A with Registered Dietitians",
  "All condition hubs (PCOS, NAFLD, Prediabetes, Metabolic Syndrome)",
];

export default function PricingPage() {
  return (
    <div className="py-20 md:py-28">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-forest-600 font-semibold uppercase tracking-widest text-sm mb-3">
            Pricing
          </p>
          <h1 className="text-4xl md:text-5xl font-extrabold text-foreground">
            Start where you are
          </h1>
          <p className="mt-4 text-xl text-muted-foreground max-w-2xl mx-auto">
            A simple first step or full membership — evidence-based tools to
            understand and improve your metabolic health.
          </p>
          <p className="mt-3 text-sm text-muted-foreground">
            Prices shown in USD ·{" "}
            <span className="text-foreground/60">
              UK (GBP) and Australian (AUD) prices available at checkout
            </span>
          </p>
        </div>

        {/* Starter Kit — full-width tripwire */}
        <div className="relative rounded-3xl border-2 border-clay-400 bg-card p-8 mb-8 flex flex-col sm:flex-row sm:items-center gap-8">
          {/* "Best first step" badge */}
          <div className="absolute -top-3.5 left-8">
            <span className="text-xs font-bold px-3 py-1 rounded-full text-white bg-clay-500">
              Best first step
            </span>
          </div>

          {/* Left: pricing block */}
          <div className="sm:w-56 flex-shrink-0">
            <p className="text-xs font-semibold uppercase tracking-widest text-clay-600 mb-1">
              One-Time Purchase
            </p>
            <h2 className="text-2xl font-bold text-foreground">Starter Kit</h2>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-5xl font-extrabold text-foreground">$27</span>
              <span className="text-muted-foreground text-sm">one time</span>
            </div>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              Everything you need to understand your metabolic baseline —
              delivered instantly.
            </p>
            {/* Spacer to push button to bottom on mobile */}
            <div className="mt-6">
              <CheckoutButton
                planId={"plan-starter-kit" as PlanId}
                label="Get Instant Access — $27"
                className="w-full h-11 font-semibold rounded-xl bg-clay-500 hover:bg-clay-600 text-white"
                variant="default"
              />
            </div>
          </div>

          {/* Right: feature list */}
          <ul className="flex-1 grid sm:grid-cols-2 gap-x-8 gap-y-3">
            {starterKitFeatures.map((f) => (
              <li key={f} className="flex items-start gap-2.5 text-sm">
                <Check className="h-4 w-4 text-clay-500 flex-shrink-0 mt-0.5" />
                <span className="text-foreground/80">{f}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-4 mb-8">
          <div className="h-px flex-1 bg-border" />
          <p className="text-sm text-muted-foreground font-medium px-4">
            Or unlock everything with a membership
          </p>
          <div className="h-px flex-1 bg-border" />
        </div>

        {/* Monthly + Annual side by side */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">

          {/* Core Monthly */}
          <div className="relative rounded-3xl border-2 border-forest-500 bg-card p-8 flex flex-col shadow-xl shadow-forest-900/10 ring-1 ring-forest-200">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
              <span className="text-xs font-bold px-3 py-1 rounded-full text-white bg-forest-600">
                Most popular
              </span>
            </div>

            <div className="mb-6">
              <p className="text-xs font-semibold uppercase tracking-widest text-forest-600 mb-1">
                Core Membership
              </p>
              <h2 className="text-xl font-bold text-foreground">Monthly</h2>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-foreground">$29</span>
                <span className="text-muted-foreground text-sm">/month</span>
              </div>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                Full platform access, renewed monthly. Cancel anytime.
              </p>
            </div>

            <ul className="space-y-3 flex-1 mb-8">
              {coreFeatures.map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-sm">
                  <Check className="h-4 w-4 text-forest-500 flex-shrink-0 mt-0.5" />
                  <span className="text-foreground/80">{f}</span>
                </li>
              ))}
            </ul>

            <CheckoutButton
              planId={"subscription-core-monthly" as PlanId}
              label="Start Monthly Membership"
              className="w-full h-11 font-semibold rounded-xl bg-forest-600 hover:bg-forest-700 text-white"
              variant="default"
            />
          </div>

          {/* Core Annual */}
          <div className="relative rounded-3xl border-2 border-honey-400 bg-card p-8 flex flex-col">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
              <span className="text-xs font-bold px-3 py-1 rounded-full text-white bg-honey-500">
                Best value — save 40%
              </span>
            </div>

            <div className="mb-6">
              <p className="text-xs font-semibold uppercase tracking-widest text-honey-600 mb-1">
                Core Membership
              </p>
              <h2 className="text-xl font-bold text-foreground">Annual</h2>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-foreground">$199</span>
                <span className="text-muted-foreground text-sm">/year</span>
              </div>
              {/* Anchored to monthly equivalent to make the saving concrete */}
              <p className="mt-1 text-sm font-medium text-honey-600">
                $16.58/mo · 2 months free
              </p>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                Everything in Monthly, billed once a year.
              </p>
            </div>

            <ul className="space-y-3 flex-1 mb-8">
              {coreFeatures.map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-sm">
                  <Check className="h-4 w-4 text-honey-500 flex-shrink-0 mt-0.5" />
                  <span className="text-foreground/80">{f}</span>
                </li>
              ))}
              {/* Annual-only bonus */}
              <li className="flex items-start gap-2.5 text-sm">
                <Check className="h-4 w-4 text-honey-500 flex-shrink-0 mt-0.5" />
                <span className="text-foreground/80 font-medium">
                  2 months free vs monthly billing
                </span>
              </li>
            </ul>

            <CheckoutButton
              planId={"subscription-core-annual" as PlanId}
              label="Start Annual Membership"
              className="w-full h-11 font-semibold rounded-xl border-2 border-honey-400 hover:bg-honey-50 text-honey-700"
              variant="outline"
            />
          </div>
        </div>

        {/* Micro-copy + trust row */}
        <div className="text-center space-y-3">
          <p className="text-sm text-muted-foreground">
            Secure checkout via{" "}
            <span className="font-medium text-foreground/70">Lemon Squeezy</span>
            {" "}(Merchant of Record). Cancel subscriptions anytime. 14-day
            satisfaction guarantee on all purchases.
          </p>
          <p className="text-xs text-muted-foreground">
            Payments processed securely · No hidden fees · Statutory refund
            rights apply
          </p>
          <p className="text-xs text-muted-foreground">
            Not sure which plan fits?{" "}
            <Link
              href="/learn"
              className="text-forest-600 hover:underline font-medium"
            >
              Browse free articles first →
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}
