// Pricing page — Sprint 2.
// Reads ?recommended= and ?profile= query params from the quiz results page
// to display a personalised recommendation banner.
// Checkout is isolated behind CHECKOUT_ENABLED flag in lib/config/checkout.ts.
// All copy is educational only — no medical claims.

import type { Metadata } from "next";
import Link from "next/link";
import { Check, ShieldCheck, BookOpen, FlaskConical } from "lucide-react";
import { CheckoutButton } from "@/components/pricing/CheckoutButton";
import type { PlanId } from "@/lib/lemon-squeezy/checkout";

export const metadata: Metadata = {
  title: "Pricing — InsulinIQ Metabolic Education Plans",
  description:
    "Evidence-informed metabolic health education. Choose from Starter Kit, Core Membership, or Annual Access — all designed to support understanding, not replace medical care.",
};

// ── Profile-aware recommendation data ────────────────────────────────────────

type ProfileKey =
  | "pcos"
  | "nafld"
  | "prediabetes"
  | "metabolic_syndrome"
  | "insulin_resistance"
  | "general_wellness";

interface ProfileData {
  label: string;
  colorClass: string;
  recommendedPlan: "starter" | "core";
  message: string;
}

const PROFILE_DATA: Record<ProfileKey, ProfileData> = {
  pcos: {
    label: "PCOS Metabolic Support",
    colorClass: "bg-sage-100 text-sage-700 border-sage-200",
    recommendedPlan: "core",
    message:
      "Your quiz profile suggests you selected PCOS-related patterns. The Core Membership educational library covers the insulin-androgen connection studied in PCOS research, evidence-informed meal structure for hormonal metabolic support, and practical food frameworks based on the 2023 International Evidence-Based PCOS Guidelines. This is educational content — not a clinical treatment plan for PCOS.",
  },
  nafld: {
    label: "Liver Metabolic Focus",
    colorClass: "bg-honey-100 text-honey-700 border-honey-200",
    recommendedPlan: "core",
    message:
      "Your quiz profile suggests you selected liver health patterns. The Core Membership library includes education on the connection between insulin resistance and metabolic liver health (NAFLD/MASLD), dietary patterns studied in liver health research, and practical food frameworks. This is educational content — not a substitute for hepatological or gastroenterological assessment.",
  },
  prediabetes: {
    label: "Blood Sugar Stabiliser",
    colorClass: "bg-clay-100 text-clay-700 border-clay-200",
    recommendedPlan: "core",
    message:
      "Your quiz profile suggests you selected blood sugar management patterns. The Core Membership library covers meal sequencing research, evidence-informed food frameworks for blood sugar stability, and the lab markers to discuss with your doctor. Educational only — not a diabetes prevention programme or medical nutrition therapy.",
  },
  metabolic_syndrome: {
    label: "Metabolic Syndrome Focus",
    colorClass: "bg-forest-100 text-forest-700 border-forest-200",
    recommendedPlan: "core",
    message:
      "Your quiz profile suggests patterns across multiple metabolic systems. The Core Membership library covers the evidence for Mediterranean-pattern eating, visceral fat education, and practical frameworks for blood pressure, lipid, and blood sugar understanding — all within a metabolic health education context. Not a substitute for GP or cardiology review.",
  },
  insulin_resistance: {
    label: "Metabolic Health Foundations",
    colorClass: "bg-forest-100 text-forest-700 border-forest-200",
    recommendedPlan: "core",
    message:
      "Your quiz profile suggests patterns associated with insulin resistance. The Core Membership library covers foundational insulin resistance education, evidence-informed meal frameworks, and practical blood sugar support strategies supported by peer-reviewed research.",
  },
  general_wellness: {
    label: "Metabolic Education Starter",
    colorClass: "bg-forest-100 text-forest-700 border-forest-200",
    recommendedPlan: "starter",
    message:
      "Your quiz profile suggests you're building foundational metabolic health knowledge. The Starter Kit is a strong first step — it covers core principles of blood sugar stability, insulin sensitivity education, and practical food frameworks to support healthier habits.",
  },
};

// ── Plan feature lists ────────────────────────────────────────────────────────

const STARTER_FEATURES = [
  "Full educational quiz profile report",
  "7-day starter food framework (protein, fibre, meal structure)",
  "Beginner food swaps for lower glycaemic-load eating",
  "Lab values discussion guide — what to ask your doctor",
  "Selected foundational articles: insulin resistance, nutrition basics, blood sugar",
];

const CORE_FEATURES = [
  "Everything in the Starter Kit",
  "Full 21-day educational meal framework, adapted to your metabolic profile",
  "Monthly meal framework refresh — new meals every 3 weeks",
  "Region-aware food examples for US, UK, and Australia",
  "Allergen-aware recipe filtering based on your quiz answers",
  "All educational condition hubs: PCOS, NAFLD/MASLD, prediabetes, metabolic syndrome",
  "Lab values companion — markers to discuss with your healthcare provider",
  "Progress check-in framework — self-assessment tools",
  "Full evidence-cited educational article library",
];

const ANNUAL_EXTRAS = [
  "Seasonal meal framework refresh",
  "Early access to new educational tools and condition hubs",
  "Full archive access — all past frameworks and educational content",
];

// ── Sub-components ────────────────────────────────────────────────────────────

function FeatureItem({ text, color = "forest" }: { text: string; color?: string }) {
  const checkColor: Record<string, string> = {
    forest: "text-forest-500",
    clay:   "text-clay-500",
    honey:  "text-honey-500",
    sage:   "text-sage-500",
  };
  return (
    <li className="flex items-start gap-2.5 text-sm">
      <Check className={`h-4 w-4 flex-shrink-0 mt-0.5 ${checkColor[color] ?? "text-forest-500"}`} />
      <span className="text-foreground/80">{text}</span>
    </li>
  );
}

function FaqItem({ q, a }: { q: string; a: string }) {
  return (
    <details className="border-b border-border last:border-0 group">
      <summary className="cursor-pointer py-4 text-sm font-semibold text-foreground hover:text-forest-700 transition-colors select-none list-none flex items-center justify-between gap-2">
        {q}
        <span className="text-muted-foreground group-open:rotate-180 transition-transform text-xs flex-shrink-0">
          ▾
        </span>
      </summary>
      <p className="pb-5 text-sm text-muted-foreground leading-relaxed">{a}</p>
    </details>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function PricingPage({ searchParams }: PageProps) {
  const params = await searchParams;

  const rawRecommended = typeof params.recommended === "string" ? params.recommended : null;
  const rawProfile     = typeof params.profile     === "string" ? params.profile     : null;

  // Normalise recommended to one of our plan tiers
  const recommendedPlan: "starter" | "core" | null =
    rawRecommended === "starter" ? "starter" :
    rawRecommended === "core"    ? "core"    :
    null;

  // Normalise profile key
  const profile: ProfileKey | null =
    rawProfile && rawProfile in PROFILE_DATA
      ? (rawProfile as ProfileKey)
      : null;

  const profileData = profile ? PROFILE_DATA[profile] : null;

  // If the URL says recommended=core but the profile data says starter (general_wellness),
  // the explicit URL param wins — trust the quiz results page.
  const effectiveRecommended: "starter" | "core" | null =
    recommendedPlan ?? profileData?.recommendedPlan ?? null;

  // Metadata for future LS custom data (forwarded when checkout is enabled)
  const checkoutMeta = { profile: profile ?? undefined, source: "pricing_page" };

  return (
    <div className="py-16 md:py-24">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">

        {/* ── S1: Hero ─────────────────────────────────────────────────────── */}
        <section className="text-center mb-12">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-forest-200 bg-forest-50 px-3 py-1 text-xs font-semibold text-forest-700 mb-4">
            <ShieldCheck className="h-3.5 w-3.5" />
            Educational platform · Not medical advice
          </span>

          <h1 className="text-4xl md:text-5xl font-extrabold text-foreground mb-4">
            Evidence-Based Metabolic Education
          </h1>

          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Structured education to help you understand how insulin resistance,
            blood sugar, and metabolic health connect — with practical food
            frameworks built around peer-reviewed research.
          </p>

          <p className="mt-4 text-sm text-muted-foreground">
            InsulinIQ is an educational service. It does not diagnose, treat, or
            prescribe. All content is designed to support informed conversations
            with your healthcare provider.
          </p>

          <p className="mt-2 text-xs text-muted-foreground/70">
            Prices shown in USD ·{" "}
            <span>UK (GBP) and Australian (AUD) prices available at checkout</span>
          </p>
        </section>

        {/* ── S2: Profile recommendation banner ───────────────────────────── */}
        {profileData && (
          <section className="mb-10 rounded-2xl border border-border bg-white p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-start gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`inline-block rounded-full border px-3 py-0.5 text-xs font-semibold ${profileData.colorClass}`}>
                    Your quiz profile: {profileData.label}
                  </span>
                </div>
                <p className="text-sm text-foreground font-semibold mb-1">
                  {effectiveRecommended === "core"
                    ? "Core Membership is designed to be the most relevant option for your educational journey."
                    : "The Starter Kit is a strong first educational step for your profile."}
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {profileData.message}
                </p>
              </div>
              <Link
                href={`#${effectiveRecommended === "starter" ? "starter-kit" : "core-membership"}`}
                className="inline-flex items-center justify-center gap-1.5 rounded-xl border-2 border-forest-300 px-4 py-2 text-sm font-semibold text-forest-700 hover:bg-forest-50 transition-colors flex-shrink-0"
              >
                See recommended plan ↓
              </Link>
            </div>
          </section>
        )}

        {/* ── S3: Plans ────────────────────────────────────────────────────── */}

        {/* Starter Kit — full-width tripwire */}
        <div
          id="starter-kit"
          className={`relative rounded-3xl border-2 bg-card p-8 mb-8 ${effectiveRecommended === "starter" ? "border-clay-500 shadow-lg shadow-clay-900/10" : "border-clay-300"}`}
        >
          {effectiveRecommended === "starter" && profileData ? (
            <div className="absolute -top-3.5 left-8">
              <span className="text-xs font-bold px-3 py-1 rounded-full text-white bg-clay-500">
                Recommended for your profile
              </span>
            </div>
          ) : (
            <div className="absolute -top-3.5 left-8">
              <span className="text-xs font-bold px-3 py-1 rounded-full text-white bg-clay-500">
                Best first step
              </span>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-8">
            {/* Left: price block */}
            <div className="sm:w-56 flex-shrink-0">
              <p className="text-xs font-semibold uppercase tracking-widest text-clay-600 mb-1">
                One-Time Purchase
              </p>
              <h2 className="text-2xl font-bold text-foreground">Starter Kit</h2>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-5xl font-extrabold text-foreground">$27</span>
                <span className="text-muted-foreground text-sm">one time</span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                An evidence-informed first step into metabolic health education —
                no subscription required.
              </p>
              <div className="mt-6">
                <CheckoutButton
                  planId={"plan-starter-kit" as PlanId}
                  label="Get Starter Kit — $27"
                  className="w-full h-11 font-semibold rounded-xl bg-clay-500 hover:bg-clay-600 text-white"
                  metadata={checkoutMeta}
                />
              </div>
            </div>

            {/* Right: features */}
            <ul className="flex-1 grid sm:grid-cols-2 gap-x-8 gap-y-3 sm:content-center">
              {STARTER_FEATURES.map((f) => (
                <FeatureItem key={f} text={f} color="clay" />
              ))}
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-4 mb-8">
          <div className="h-px flex-1 bg-border" />
          <p className="text-sm text-muted-foreground font-medium px-4">
            Or unlock everything with a membership
          </p>
          <div className="h-px flex-1 bg-border" />
        </div>

        {/* Core Monthly + Annual — side by side */}
        <div className="grid md:grid-cols-2 gap-6 mb-10" id="core-membership">

          {/* Core Monthly */}
          <div
            className={`relative rounded-3xl border-2 bg-card p-8 flex flex-col ${effectiveRecommended === "core" ? "border-forest-500 shadow-xl shadow-forest-900/10 ring-1 ring-forest-200" : "border-forest-400"}`}
          >
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
              <span className="text-xs font-bold px-3 py-1 rounded-full text-white bg-forest-600 whitespace-nowrap">
                {effectiveRecommended === "core" && profileData
                  ? "Recommended for your profile"
                  : "Most popular"}
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
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                Full educational platform access, refreshed monthly. Cancel anytime.
              </p>
            </div>

            <ul className="space-y-3 flex-1 mb-8">
              {CORE_FEATURES.map((f) => (
                <FeatureItem key={f} text={f} color="forest" />
              ))}
            </ul>

            <CheckoutButton
              planId={"subscription-core-monthly" as PlanId}
              label="Start Core Membership — $29/month"
              className="w-full h-11 font-semibold rounded-xl bg-forest-600 hover:bg-forest-700 text-white"
              metadata={checkoutMeta}
            />
          </div>

          {/* Core Annual */}
          <div className="relative rounded-3xl border-2 border-honey-400 bg-card p-8 flex flex-col">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
              <span className="text-xs font-bold px-3 py-1 rounded-full text-white bg-honey-500 whitespace-nowrap">
                Best value — save 43%
              </span>
            </div>

            <div className="mb-6">
              <p className="text-xs font-semibold uppercase tracking-widest text-honey-600 mb-1">
                Core Membership
              </p>
              <h2 className="text-xl font-bold text-foreground">Annual Access</h2>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-foreground">$199</span>
                <span className="text-muted-foreground text-sm">/year</span>
              </div>
              <p className="mt-1 text-sm font-medium text-honey-600">
                $16.58/mo · 2 months free vs monthly
              </p>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                Everything in Core Membership, billed once a year. Best value for
                long-term education.
              </p>
            </div>

            <ul className="space-y-3 flex-1 mb-8">
              {CORE_FEATURES.map((f) => (
                <FeatureItem key={f} text={f} color="honey" />
              ))}
              {ANNUAL_EXTRAS.map((f) => (
                <FeatureItem key={f} text={f} color="honey" />
              ))}
            </ul>

            <CheckoutButton
              planId={"subscription-core-annual" as PlanId}
              label="Start Annual Access — $199/year"
              className="w-full h-11 font-semibold rounded-xl border-2 border-honey-400 hover:bg-honey-50 text-honey-700"
              variant="outline"
              metadata={checkoutMeta}
            />
          </div>
        </div>

        {/* Trust + legal row */}
        <div className="text-center space-y-3 mb-14">
          <p className="text-sm text-muted-foreground">
            Payments processed securely via{" "}
            <span className="font-medium text-foreground/70">Lemon Squeezy</span>{" "}
            (Merchant of Record — VAT/GST/sales tax handled automatically).
            Cancel subscriptions anytime. 14-day satisfaction guarantee on all
            purchases.
          </p>
          <p className="text-xs text-muted-foreground">
            No hidden fees · No automatic upsells · Educational content only
          </p>

          {/* Statutory rights — collapsible */}
          <details className="mt-4 text-left max-w-2xl mx-auto rounded-xl border border-border bg-secondary/30 text-xs text-muted-foreground">
            <summary className="cursor-pointer px-4 py-3 font-medium text-foreground/60 select-none">
              Your statutory refund &amp; cancellation rights ▸
            </summary>
            <div className="px-4 pb-4 pt-2 space-y-3 leading-relaxed">
              <p>
                <strong className="text-foreground/70">United Kingdom:</strong>{" "}
                You have cancellation rights under the Consumer Contracts Regulations
                2013. For subscriptions, you may cancel within 14 days of purchase.
                For one-time digital products where delivery begins immediately, please
                contact{" "}
                <a href="mailto:support@insuliniq.com" className="underline">
                  support@insuliniq.com
                </a>{" "}
                within 14 days to discuss your options.
              </p>
              <p>
                <strong className="text-foreground/70">Australia:</strong>{" "}
                Our products come with guarantees that cannot be excluded under the
                Australian Consumer Law (ACL, Schedule 2). You are entitled to a
                replacement or refund for a major failure and compensation for other
                reasonably foreseeable loss or damage.
              </p>
              <p>
                <strong className="text-foreground/70">United States:</strong>{" "}
                14-day satisfaction guarantee on all purchases. Contact{" "}
                <a href="mailto:support@insuliniq.com" className="underline">
                  support@insuliniq.com
                </a>{" "}
                within 30 days of purchase.
              </p>
            </div>
          </details>

          <p className="text-xs text-muted-foreground pt-1">
            Not sure which plan fits?{" "}
            <Link href="/learn" className="text-forest-600 hover:underline font-medium">
              Browse free articles first →
            </Link>
          </p>
        </div>

        {/* ── S4: Free vs Paid ─────────────────────────────────────────────── */}
        <section className="mb-14">
          <h2 className="text-2xl font-bold text-foreground text-center mb-2">
            What you can access at InsulinIQ
          </h2>
          <p className="text-center text-sm text-muted-foreground mb-8 max-w-xl mx-auto">
            Core educational content is freely accessible. Paid plans unlock
            the structured frameworks, region-adapted meal guides, and ongoing
            refreshes.
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Free */}
            <div className="rounded-2xl border border-border bg-white p-6">
              <div className="flex items-center gap-2 mb-4">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-forest-100">
                  <BookOpen className="h-4 w-4 text-forest-600" />
                </span>
                <h3 className="font-bold text-foreground">Always free</h3>
              </div>
              <ul className="space-y-3">
                {[
                  "Educational quiz — metabolic health pattern matching",
                  "Short personalised educational profile from your answers",
                  "First 3 days of the starter framework",
                  "Selected foundational articles on insulin resistance, PCOS, NAFLD, prediabetes",
                  "Safety screening notice (if relevant to your health status)",
                  "Educational disclaimers and healthcare provider guidance",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm">
                    <Check className="h-4 w-4 text-forest-400 flex-shrink-0 mt-0.5" />
                    <span className="text-foreground/70">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Paid */}
            <div className="rounded-2xl border-2 border-forest-200 bg-forest-50/40 p-6">
              <div className="flex items-center gap-2 mb-4">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-forest-600">
                  <FlaskConical className="h-4 w-4 text-white" />
                </span>
                <h3 className="font-bold text-foreground">Unlocked with a paid plan</h3>
              </div>
              <ul className="space-y-3">
                {[
                  "Full educational meal framework — 21 days adapted to your profile",
                  "Complete quiz profile report with actionable educational priorities",
                  "Food swaps for US, UK, and Australian supermarkets",
                  "Allergen-aware and diet-filtered recipe library",
                  "Progress self-check framework — track patterns over time",
                  "Full educational library — all condition hubs and deep-dive articles",
                  "Monthly meal framework refresh — new content every 3 weeks",
                  "Lab values companion — what to request and discuss with your doctor",
                  "Downloadable educational guides (PDF format)",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm">
                    <Check className="h-4 w-4 text-forest-600 flex-shrink-0 mt-0.5" />
                    <span className="text-foreground/80">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* ── S5: FAQ ──────────────────────────────────────────────────────── */}
        <section className="mb-14">
          <h2 className="text-2xl font-bold text-foreground text-center mb-8">
            Frequently Asked Questions
          </h2>
          <div className="rounded-2xl border border-border bg-white px-6 divide-y divide-border">
            <FaqItem
              q="Is InsulinIQ medical advice?"
              a="No. InsulinIQ is an educational platform that provides evidence-informed content about metabolic health, nutrition, and insulin resistance. Nothing on this platform constitutes medical advice, clinical guidance, or a treatment plan. All content is designed to support informed conversations with your healthcare provider — not to replace professional medical judgment."
            />
            <FaqItem
              q="Can InsulinIQ diagnose insulin resistance or any condition?"
              a="No. Your quiz results are an educational pattern match based on your self-reported answers — they are not a clinical assessment, blood test, or diagnosis. Only a qualified healthcare professional can diagnose insulin resistance, PCOS, fatty liver disease, prediabetes, or any other condition. If you have concerns about your metabolic health, speak with your GP or a specialist."
            />
            <FaqItem
              q="What is included in the Starter Kit?"
              a="The Starter Kit is a one-time educational package that includes your full quiz profile report, a 7-day starter food framework built around protein, fibre, and meal structure, a beginner food swaps guide for lower glycaemic-load eating, a lab values discussion guide to help you prepare for conversations with your doctor, and selected foundational educational articles on insulin resistance, nutrition basics, and blood sugar stability."
            />
            <FaqItem
              q="Why choose Core Membership?"
              a="Core Membership is designed for people who want ongoing structured metabolic health education, not just a one-time starting point. It includes a full 21-day educational meal framework adapted to your metabolic profile, monthly refreshes, allergen-aware recipe filtering, region-specific food examples for US, UK, and Australia, and access to all educational condition hubs covering PCOS, NAFLD, prediabetes, metabolic syndrome, and insulin resistance."
            />
            <FaqItem
              q="Why choose Annual Access?"
              a="Annual Access includes everything in Core Membership at a 43% discount — equivalent to 2 months free. It also includes seasonal meal framework refreshes, early access to new educational tools and condition hubs, and full archive access. It's designed for people committed to a longer-term educational journey."
            />
            <FaqItem
              q="Can I cancel my monthly membership?"
              a="Yes. Monthly memberships can be cancelled at any time from your account settings — no questions asked, no cancellation fee. Your access continues until the end of the billing period. Annual memberships can also be cancelled at any time, with remaining time non-refundable except where required by applicable consumer law."
            />
            <FaqItem
              q="Is InsulinIQ suitable for PCOS?"
              a="InsulinIQ includes a specific educational profile and content library for the PCOS-insulin connection. Our content explains the insulin-androgen mechanism studied in PCOS research, evidence-informed dietary patterns, and practical food frameworks based on the 2023 International Evidence-Based PCOS Guidelines. This is educational content about metabolic support — not a clinical treatment plan for PCOS. Always work with your gynaecologist or endocrinologist for PCOS management."
            />
            <FaqItem
              q="Is InsulinIQ suitable for fatty liver / NAFLD / MASLD?"
              a="InsulinIQ includes educational content specifically on the metabolic connection between insulin resistance and fatty liver disease (NAFLD/MASLD). Our library covers evidence-informed dietary approaches, the role of visceral fat, and practical frameworks for supporting metabolic liver health. This is educational content — not a clinical treatment for liver disease. Always work with a hepatologist or gastroenterologist for liver health management."
            />
            <FaqItem
              q="What if I have diabetes or take medication?"
              a="If you have type 1 diabetes, take insulin, or take any glucose-lowering medication, you must speak with your diabetes care team before making significant dietary changes. Our educational content is not designed as medical nutrition therapy for people with diabetes. If you take medication for blood pressure, lipids, or any other metabolic condition, consult your prescribing doctor before significantly changing your diet — some dietary changes can affect how medications work."
            />
            <FaqItem
              q="Are the meal frameworks allergen-aware?"
              a="Yes. If you entered allergens in the quiz (gluten, dairy, eggs, nuts, soy, fish, shellfish, sesame, halal, kosher), your meal frameworks and recipe library are filtered accordingly. We always recommend double-checking product labels for allergen cross-contamination, particularly if you have a severe or anaphylactic allergy."
            />
            <FaqItem
              q="How is my health data used?"
              a="Your quiz answers are stored securely and used only to generate your educational profile and personalise your content experience. We do not sell, share, or use your health information for advertising purposes. You can request deletion of your data at any time by emailing support@insuliniq.com. See our Privacy Policy for full details."
            />
            <FaqItem
              q="How do refunds work?"
              a="We offer a 14-day satisfaction guarantee on all purchases. If you don't find value in the first 14 days, contact us at support@insuliniq.com for a full refund. UK customers also retain statutory rights under the Consumer Contracts Regulations 2013. Australian customers retain rights under the Australian Consumer Law (ACL). Full refund and cancellation terms are displayed at checkout."
            />
          </div>
        </section>

        {/* ── Disclaimer ───────────────────────────────────────────────────── */}
        <section className="rounded-2xl bg-gradient-to-br from-secondary to-muted border border-border/60 p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-forest-100">
              <ShieldCheck className="h-5 w-5 text-forest-600" aria-hidden />
            </div>
            <div>
              <p className="mb-1.5 text-sm font-semibold text-foreground">
                Educational content only — not medical advice
              </p>
              <p className="text-sm leading-relaxed text-muted-foreground">
                InsulinIQ provides evidence-informed education about metabolic health,
                insulin resistance, nutrition, and lifestyle habits. This platform does
                not diagnose, treat, or prescribe. Content is based on publicly
                available peer-reviewed research and is designed to support informed
                conversations with qualified healthcare providers — not to replace
                professional medical judgment.
              </p>
              <p className="mt-2 text-xs text-muted-foreground/60">
                If you have diabetes, PCOS, fatty liver disease, kidney disease,
                advanced liver disease, are pregnant or breastfeeding, take insulin
                or glucose-lowering medication, or have a history of eating disorders,
                speak with a qualified healthcare professional before making major
                dietary changes.
              </p>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
