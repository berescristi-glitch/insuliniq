// Shared presentational component for quiz results.
// Used by both the server page (app/quiz/results/page.tsx) and the client skip
// shell (components/quiz/ResultsSkipShell.tsx).
// No "use client" directive — no hooks here. Client leaves are imported below.

import Link from "next/link";
import { ArrowRight, BookOpen, FlaskConical, ShieldCheck, Check } from "lucide-react";
import { MedicalDisclaimer } from "@/components/content/MedicalDisclaimer";
import { SafetyNotice } from "@/components/quiz/SafetyNotice";
import { LockedContent } from "@/components/quiz/LockedContent";
import { StickyResultsCTA } from "@/components/quiz/StickyResultsCTA";
import { CheckoutButton } from "@/components/pricing/CheckoutButton";
import {
  computeEducationalScore,
  SIGNAL_LABEL,
  SIGNAL_WIDTH,
} from "@/lib/quiz/scorer";
import type { MatchResult } from "@/lib/quiz/matcher";
import type { QuizAnswers, Allergen, CookingTime, CookingSkill } from "@/lib/quiz/types";

// ── Tailwind colour maps (must be complete strings — Tailwind purges fragments) ─

const badge: Record<string, string> = {
  forest: "bg-forest-100 text-forest-700 border-forest-200",
  sage:   "bg-sage-100 text-sage-700 border-sage-200",
  clay:   "bg-clay-100 text-clay-700 border-clay-200",
  honey:  "bg-honey-100 text-honey-700 border-honey-200",
};

const heading: Record<string, string> = {
  forest: "text-forest-800",
  sage:   "text-sage-800",
  clay:   "text-clay-800",
  honey:  "text-honey-800",
};

const accent: Record<string, string> = {
  forest: "border-forest-400",
  sage:   "border-sage-400",
  clay:   "border-clay-400",
  honey:  "border-honey-400",
};

const categoryBadge: Record<string, string> = {
  forest: "bg-forest-50 text-forest-700 border-forest-200",
  sage:   "bg-sage-50 text-sage-700 border-sage-200",
  clay:   "bg-clay-50 text-clay-700 border-clay-200",
  honey:  "bg-honey-50 text-honey-700 border-honey-200",
};

const cardBorder: Record<string, string> = {
  forest: "border-forest-100",
  sage:   "border-sage-100",
  clay:   "border-clay-100",
  honey:  "border-honey-100",
};

// Bar fill colours (inline-style width, Tailwind class for colour only)
const barFill: Record<string, string> = {
  low_pressure:      "bg-forest-500",
  moderate_pressure: "bg-honey-500",
  elevated_attention:"bg-clay-500",
};

// ── Personalisation helpers ───────────────────────────────────────────────────

const ALLERGEN_LABEL: Partial<Record<Allergen, string>> = {
  gluten:    "gluten-free",
  dairy:     "dairy-free",
  eggs:      "egg-free",
  peanuts:   "peanut-free",
  tree_nuts: "nut-free",
  soy:       "soy-free",
  fish:      "fish-free",
  shellfish: "shellfish-free",
  sesame:    "sesame-free",
  halal:     "halal",
  kosher:    "kosher",
};

const COOKING_TIME_LABEL: Record<CookingTime, string> = {
  under_20: "under 20 minutes available to cook",
  "20_40":  "20–40 minutes available to cook",
  "40_60":  "40–60 minutes available to cook",
  "60_plus":"60+ minutes available to cook",
};

const SKILL_LABEL: Record<CookingSkill, string> = {
  beginner:     "beginner cooking skill",
  basics:       "basic cooking skill",
  confident:    "confident in the kitchen",
  experimental: "adventurous cooking style",
};

function buildPersonalizationNote(answers: QuizAnswers): string | null {
  const parts: string[] = [];

  // Country / region
  if (answers.region) {
    const c = answers.region.country;
    if (c === "US") parts.push("United States");
    else if (c === "UK") parts.push("UK");
    else if (c === "AU") parts.push("Australia");
  }

  // Cooking time
  if (answers.cookingTime) {
    parts.push(COOKING_TIME_LABEL[answers.cookingTime]);
  }

  // Allergens — show up to 2
  if (answers.allergens.length > 0) {
    const labels = answers.allergens
      .map((a) => ALLERGEN_LABEL[a] ?? a)
      .slice(0, 2);
    parts.push(`${labels.join(" and ")} needs`);
  }

  // Cooking skill (only if beginner or basic — adds context)
  if (answers.cookingSkill === "beginner" || answers.cookingSkill === "basics") {
    parts.push(SKILL_LABEL[answers.cookingSkill]);
  }

  if (parts.length < 2) return null;

  const [first, ...rest] = parts;
  const detail = rest.join(", ");

  return `Because you selected ${first}, with ${detail}, your plan prioritises practical, accessible meals that fit your schedule and dietary needs — not an idealised routine you'd abandon in week one.`;
}

// ── Sub-components ────────────────────────────────────────────────────────────

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-xl font-bold text-foreground mb-5">{children}</h2>
  );
}

function FaqItem({ q, a }: { q: string; a: string }) {
  return (
    <details className="border-b border-border last:border-0 group">
      <summary className="cursor-pointer py-4 text-sm font-semibold text-foreground hover:text-forest-700 transition-colors select-none list-none flex items-center justify-between gap-2">
        {q}
        <span className="text-muted-foreground group-open:rotate-180 transition-transform text-xs">▾</span>
      </summary>
      <p className="pb-5 text-sm text-muted-foreground leading-relaxed">{a}</p>
    </details>
  );
}

// ── Main export ───────────────────────────────────────────────────────────────

interface Props {
  result: MatchResult;
  answers: QuizAnswers;
  // Allows /quiz-v2/results to point "Retake" back to /quiz-v2 instead of /quiz.
  // Default: "/quiz" — preserves v1 behaviour unchanged.
  retakeHref?: string;
}

export function ResultsDisplay({ result, answers, retakeHref = "/quiz" }: Props) {
  const c = result.profileColor;
  const score = computeEducationalScore(answers);
  const personalizationNote = buildPersonalizationNote(answers);

  const scoreRows = [
    { label: "Insulin Sensitivity Signal",  level: score.insulinSensitivity },
    { label: "Blood Sugar Stability Signal", level: score.bloodSugarStability },
    { label: "Lifestyle Friction Signal",    level: score.lifestyleFriction },
  ] as const;

  const freeDays   = result.planDays.filter((d) => !d.locked);
  const lockedDays = result.planDays.filter((d) => d.locked);

  // Profile-aware pricing query params for the /pricing page
  // general_wellness users are better served by the Starter Kit (lower commitment)
  const recommendedPlan = result.profile === "general_wellness" ? "starter" : "core";
  const pricingHref = `/pricing?recommended=${recommendedPlan}&profile=${result.profile}`;

  return (
    <>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 md:py-14 pb-20 sm:pb-14">

        {/* ── S1: Hero ─────────────────────────────────────────────────────── */}
        <div className="mb-10 text-center space-y-4">
          <span className={`inline-block rounded-full border px-4 py-1.5 text-sm font-semibold ${badge[c]}`}>
            Your Educational Metabolic Profile
          </span>

          <h1 className={`text-3xl sm:text-4xl font-bold leading-tight ${heading[c]}`}>
            {result.heroTitle}
          </h1>

          <p className="max-w-prose mx-auto text-base text-muted-foreground leading-relaxed">
            {result.heroSubtitle}
          </p>

          <p className="text-xs text-muted-foreground/70 max-w-sm mx-auto">
            This profile is educational, not diagnostic. It is not a substitute for
            medical advice. Speak with your healthcare provider before making significant
            dietary changes.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <Link
              href={pricingHref}
              className="inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors bg-forest-600 hover:bg-forest-700"
            >
              Unlock My Full Plan
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/learn"
              className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-border px-6 py-3 text-sm font-semibold text-foreground hover:border-forest-300 hover:bg-forest-50 transition-colors"
            >
              Explore free articles
            </Link>
          </div>
        </div>

        {/* ── S2: Metabolic Snapshot ───────────────────────────────────────── */}
        <section className="mb-10 rounded-2xl border border-border bg-white p-6 space-y-5">
          <div>
            <SectionHeading>Your Metabolic Snapshot</SectionHeading>
            <p className="text-xs text-muted-foreground -mt-3 mb-4">
              Educational indicators based on your quiz answers. Not a blood test result.
            </p>
          </div>

          <div className="space-y-4">
            {scoreRows.map(({ label, level }) => (
              <div key={label}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm font-medium text-foreground">{label}</span>
                  <span className="text-xs font-semibold text-muted-foreground">
                    {SIGNAL_LABEL[level]}
                  </span>
                </div>
                <div className="h-2.5 w-full rounded-full bg-muted overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${barFill[level]}`}
                    style={{ width: SIGNAL_WIDTH[level] }}
                  />
                </div>
              </div>
            ))}
          </div>

          <p className="text-xs text-muted-foreground/70 border-t border-border pt-3">
            These signals are pattern-matched from your self-reported answers — not
            derived from laboratory data. Always discuss your actual metabolic markers
            with a qualified healthcare provider.
          </p>
        </section>

        {/* ── S3: Friction Points ──────────────────────────────────────────── */}
        <section className="mb-10">
          <SectionHeading>Your 3 Main Metabolic Friction Points</SectionHeading>

          {/* Personalisation note — shows which quiz inputs shaped this section */}
          {personalizationNote && (
            <div className={`mb-5 rounded-xl border px-4 py-3 text-sm text-muted-foreground bg-muted/30 ${accent[c]}`}>
              <span className="font-semibold text-foreground">Adapted to your answers: </span>
              {personalizationNote}
            </div>
          )}

          <div className="space-y-4">
            {result.frictionPoints.map((fp) => (
              <div
                key={fp.title}
                className="rounded-xl border border-border bg-white p-5 space-y-2"
              >
                <div className="flex items-center gap-2">
                  <span className="text-xl leading-none">{fp.icon}</span>
                  <h3 className="text-sm font-bold text-foreground">{fp.title}</h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {fp.body}
                </p>
                <p className={`text-sm font-medium text-foreground border-l-2 pl-3 ${accent[c]}`}>
                  {fp.implication}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ── SafetyNotice — required before any paid CTA ──────────────────── */}
        <SafetyNotice answers={answers} />

        {/* ── S4: What This May Mean ───────────────────────────────────────── */}
        <section className="mb-10 rounded-2xl bg-muted/40 border border-border p-6 space-y-3">
          <SectionHeading>What This May Mean For You</SectionHeading>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {result.whatItMeans}
          </p>
          <p className="text-xs text-muted-foreground/70">
            Source: {result.whatItMeansCitation}
          </p>
          <p className="text-xs text-muted-foreground/60 border-t border-border pt-3">
            This educational explanation may not apply to your specific situation. Many
            individual factors — genetics, medications, other conditions — affect how
            these patterns present. Discuss your symptoms and metabolic markers with a
            qualified healthcare provider for a personalised assessment.
          </p>
        </section>

        {/* ── S5: First 7 Days ─────────────────────────────────────────────── */}
        <section className="mb-10">
          <SectionHeading>Your First 7 Days</SectionHeading>
          <p className="text-sm text-muted-foreground mb-5">
            The first three days are free. The full 7-day framework — and your
            complete 21-day plan — are included in your membership.
          </p>

          <div className="space-y-3">
            {freeDays.map((d) => (
              <div
                key={d.day}
                className={`rounded-xl border-2 bg-white p-5 ${accent[c]}`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${badge[c]}`}>
                    {d.day}
                  </span>
                  <h3 className="text-sm font-bold text-foreground">{d.title}</h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {d.content}
                </p>
              </div>
            ))}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {lockedDays.map((d) => (
                <LockedContent
                  key={d.day}
                  day={d.day}
                  title={d.title}
                  preview={d.content}
                  href={pricingHref}
                />
              ))}
            </div>
          </div>

          <div className="mt-5 text-center">
            <Link
              href={pricingHref}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-forest-700 hover:text-forest-800 underline underline-offset-2 transition-colors"
            >
              Unlock all 7 days — and the full 21-day plan
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </section>

        {/* ── S6: Unlock Your Full Plan ────────────────────────────────────── */}
        <section className={`mb-10 rounded-2xl border-2 bg-white p-8 ${accent[c]}`}>
          <SectionHeading>What's Inside Your Full Plan</SectionHeading>

          <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-3 mb-8">
            {[
              "21-day meal plan adapted to your metabolic profile",
              "Shopping lists for your country and local stores",
              "Every recipe filtered for your allergens and diet",
              "Food swaps for US, UK, and AU supermarkets",
              "Lab values companion — what to ask your doctor",
              "All condition hubs and educational article library",
              "Monthly progress check-in framework",
              "Monthly plan refresh every 3 weeks",
            ].map((f) => (
              <li key={f} className="flex items-start gap-2.5 text-sm">
                <Check className="h-4 w-4 text-forest-500 flex-shrink-0 mt-0.5" />
                <span className="text-foreground/80">{f}</span>
              </li>
            ))}
          </ul>

          <div className="mb-8">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
              Start reading for free
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {result.articles.map((article) => (
                <Link
                  key={article.href}
                  href={article.href}
                  className={`group block rounded-xl border-2 bg-white p-4 transition-all hover:shadow-md ${cardBorder[c]}`}
                >
                  <span className={`inline-block rounded-full border px-2.5 py-0.5 text-xs font-medium mb-2 ${categoryBadge[c]}`}>
                    {article.category}
                  </span>
                  <p className="text-xs font-semibold text-foreground leading-snug group-hover:text-forest-700 transition-colors">
                    {article.title}
                  </p>
                  <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground group-hover:text-forest-600 transition-colors">
                    Read free
                    <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <CheckoutButton
              planId="subscription-core-monthly"
              label="Start Full Plan — $29/month"
              className="h-12 px-6 rounded-xl bg-forest-600 hover:bg-forest-700 text-white font-semibold text-sm"
            />
            <Link
              href={pricingHref}
              className="inline-flex items-center justify-center rounded-xl border-2 border-border px-6 h-12 text-sm font-semibold text-foreground hover:border-forest-300 hover:bg-forest-50 transition-colors"
            >
              See all plans
            </Link>
          </div>
          <p className="mt-3 text-center text-xs text-muted-foreground">
            Cancel anytime · 14-day satisfaction guarantee · Secure checkout via Lemon Squeezy
          </p>
        </section>

        {/* ── S7: Evidence & Editorial Standard ───────────────────────────── */}
        <section className="mb-10">
          <SectionHeading>Evidence-Based, Not Medical Advice</SectionHeading>
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="rounded-xl border border-border bg-white p-5 space-y-2">
              <FlaskConical className="h-5 w-5 text-forest-600" />
              <p className="text-sm font-semibold text-foreground">Science-Cited</p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Every educational claim links to peer-reviewed research. No invented
                statistics, no AI-generated citations.
              </p>
            </div>
            <div className="rounded-xl border border-border bg-white p-5 space-y-2">
              <BookOpen className="h-5 w-5 text-forest-600" />
              <p className="text-sm font-semibold text-foreground">Educational Only</p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Content reviewed against ADA, NHS, Diabetes Australia, EASL, and the
                2023 International PCOS Guidelines. Built to inform, not to prescribe.
              </p>
            </div>
            <div className="rounded-xl border border-border bg-white p-5 space-y-2">
              <ShieldCheck className="h-5 w-5 text-forest-600" />
              <p className="text-sm font-semibold text-foreground">Built for Safer Decision-Making</p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                InsulinIQ does not diagnose, treat, or prescribe. Every plan includes
                clear guidance on when to speak with your healthcare provider.
              </p>
            </div>
          </div>
        </section>

        {/* ── MedicalDisclaimer — required before pricing CTA ─────────────── */}
        <MedicalDisclaimer />

        {/* ── S8: Pricing CTA ──────────────────────────────────────────────── */}
        <section className="mb-10 space-y-4" id="pricing">
          <SectionHeading>Choose How You Want to Start</SectionHeading>

          {/* Monthly — featured / recommended */}
          <div className="relative rounded-2xl border-2 border-forest-500 bg-white p-6 shadow-lg shadow-forest-900/10">
            <div className="absolute -top-3 left-6">
              <span className="rounded-full bg-forest-600 px-3 py-1 text-xs font-bold text-white">
                Recommended for your profile
              </span>
            </div>
            <div className="sm:flex sm:items-center sm:justify-between gap-6">
              <div className="mb-4 sm:mb-0">
                <p className="text-xs font-semibold uppercase tracking-widest text-forest-600 mb-0.5">
                  Core Membership
                </p>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-foreground">$29</span>
                  <span className="text-muted-foreground text-sm">/month</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Full platform access · Cancel anytime
                </p>
              </div>
              <CheckoutButton
                planId="subscription-core-monthly"
                label="Start My Plan →"
                className="w-full sm:w-auto h-11 px-8 rounded-xl bg-forest-600 hover:bg-forest-700 text-white font-semibold text-sm"
              />
            </div>
          </div>

          {/* Annual */}
          <div className="relative rounded-2xl border-2 border-honey-400 bg-white p-6">
            <div className="absolute -top-3 left-6">
              <span className="rounded-full bg-honey-500 px-3 py-1 text-xs font-bold text-white">
                Best value — save 43%
              </span>
            </div>
            <div className="sm:flex sm:items-center sm:justify-between gap-6">
              <div className="mb-4 sm:mb-0">
                <p className="text-xs font-semibold uppercase tracking-widest text-honey-600 mb-0.5">
                  Core Membership — Annual
                </p>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-foreground">$199</span>
                  <span className="text-muted-foreground text-sm">/year</span>
                </div>
                <p className="text-xs font-medium text-honey-600 mt-0.5">
                  $16.58/mo · 2 months free vs monthly
                </p>
              </div>
              <CheckoutButton
                planId="subscription-core-annual"
                label="Start Annual Plan"
                className="w-full sm:w-auto h-11 px-8 rounded-xl border-2 border-honey-400 text-honey-700 font-semibold text-sm hover:bg-honey-50"
                variant="outline"
              />
            </div>
          </div>

          {/* Starter — one-time */}
          <div className="rounded-2xl border-2 border-clay-300 bg-white p-6">
            <div className="sm:flex sm:items-center sm:justify-between gap-6">
              <div className="mb-4 sm:mb-0">
                <p className="text-xs font-semibold uppercase tracking-widest text-clay-600 mb-0.5">
                  One-Time · Starter Kit
                </p>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-extrabold text-foreground">$27</span>
                  <span className="text-muted-foreground text-sm">one time</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Science guide + 7-day template + lab values companion
                </p>
              </div>
              <CheckoutButton
                planId="plan-starter-kit"
                label="Get Instant Access"
                className="w-full sm:w-auto h-11 px-8 rounded-xl bg-clay-500 hover:bg-clay-600 text-white font-semibold text-sm"
              />
            </div>
          </div>

          <p className="text-center text-xs text-muted-foreground">
            UK (GBP) and Australian (AUD) prices available at checkout ·
            Payments processed securely via Lemon Squeezy
          </p>
        </section>

        {/* ── S9: FAQ ──────────────────────────────────────────────────────── */}
        <section className="mb-10 rounded-2xl border border-border bg-white px-6">
          <SectionHeading>
            <span className="block pt-6">Frequently Asked Questions</span>
          </SectionHeading>
          <FaqItem
            q="Is this medical advice?"
            a="No. InsulinIQ is an educational platform. Everything here is educational content about nutrition, metabolic health, and lifestyle habits. It is not medical advice, clinical guidance, or a treatment plan. Always discuss significant dietary changes with your healthcare provider."
          />
          <FaqItem
            q="Can this diagnose insulin resistance or my condition?"
            a="No. Your quiz profile is an educational pattern match, not a clinical assessment. Only a qualified healthcare provider can diagnose insulin resistance, PCOS, fatty liver disease, or any other condition. If you suspect you have a metabolic condition, speak with your GP or specialist."
          />
          <FaqItem
            q="Can I use this with PCOS?"
            a="Yes — InsulinIQ has a specific educational profile for PCOS and metabolic health. Our content explains the insulin-androgen connection that underlies many PCOS symptoms. It is educational, not a clinical treatment plan. Always work with your gynaecologist or endocrinologist for PCOS management."
          />
          <FaqItem
            q="Can I follow this if I have diabetes?"
            a="If you have type 1 diabetes or take insulin or glucose-lowering medication, speak with your diabetes care team before making significant dietary changes. Our content is educational and is not designed as medical nutrition therapy for people with diabetes."
          />
          <FaqItem
            q="What if I take medication for blood pressure or blood sugar?"
            a="If you take medication for any metabolic condition, consult your prescribing doctor before significantly changing your diet. Some dietary changes — particularly reducing carbohydrates — can interact with certain medications. This is a precaution, not a barrier to learning."
          />
          <FaqItem
            q="Is the plan gluten-free or allergen-aware?"
            a="Yes. If you entered allergens in the quiz (gluten, dairy, eggs, nuts, etc.), your plan and recipes are filtered accordingly. Always double-check product labels for allergen cross-contamination, and notify your healthcare provider if you have a severe allergy."
          />
          <FaqItem
            q="Can I cancel anytime?"
            a="Yes. Monthly subscriptions can be cancelled at any time from your account settings — no questions asked. Annual subscriptions can be cancelled too; the remaining period is non-refundable except where required by local consumer law (UK Consumer Rights Act 2015, Australian Consumer Law)."
          />
          <FaqItem
            q="How is my health information used?"
            a="Your quiz answers are stored securely and used only to generate your educational profile and personalise your content. We do not sell or share personal health information with third parties. You can request deletion of your data at any time by emailing support@insuliniq.com."
          />
          <FaqItem
            q="What should I discuss with my doctor?"
            a="Before starting any new dietary approach, it's worth discussing: your current metabolic markers (fasting glucose, fasting insulin, HbA1c, lipids), any medications that may interact with dietary change, and your individual goals. Our Lab Values Companion — included in the membership — gives you a checklist of what to ask."
          />
          <div className="pb-6" />
        </section>

        {/* Retake link — deliberately subtle; href is /quiz for v1, /quiz-v2 for v2 */}
        <p className="text-center text-xs text-muted-foreground/50 mb-4">
          <Link
            href={retakeHref}
            className="hover:text-muted-foreground hover:underline transition-colors"
          >
            Retake the quiz
          </Link>
        </p>

      </div>

      {/* Sticky mobile CTA — client component, renders below scroll threshold */}
      <StickyResultsCTA
        profileColor={result.profileColor}
        label="Unlock Full Plan — $29/month"
      />
    </>
  );
}
