// Pure profile-matching logic — no imports from Next.js or Supabase.
// Runs on the server (results page) and is also called from the server action.
// Exported MatchResult is serializable so it can be passed as JSON.

import type { QuizAnswers, MetabolicProfile } from "./types";

export interface ArticleRef {
  href: string;
  title: string;
  category: string;
}

export interface MatchResult {
  profile: MetabolicProfile;
  profileLabel: string;
  // Maps to the Tailwind color scale prefix (forest / sage / clay / honey)
  profileColor: "forest" | "sage" | "clay" | "honey";
  description: string;
  articles: ArticleRef[];
  planHref: string;
}

export function matchProfile(answers: QuizAnswers): MatchResult {
  const { goal, symptoms } = answers;

  const hasPCOS =
    goal === "pcos" ||
    symptoms.includes("irregular_periods") ||
    symptoms.includes("acne_or_hair_growth");

  const hasNAFLD =
    goal === "liver_health" || symptoms.includes("fatty_liver");

  const hasHighBP = symptoms.includes("high_blood_pressure");
  const hasHighTrig = symptoms.includes("high_triglycerides");
  const hasHighBG = symptoms.includes("high_blood_sugar");

  // Metabolic syndrome: ≥2 flags across the classic cluster
  const metSynFlags = [
    hasHighBP,
    hasHighTrig,
    hasHighBG,
    symptoms.includes("dark_skin_patches"),
  ].filter(Boolean).length;

  // Priority order mirrors clinical relevance: PCOS > NAFLD > MetSyn > Prediabetes > default IR
  if (hasPCOS && !hasNAFLD) {
    return {
      profile: "pcos",
      profileLabel: "PCOS Metabolic Support",
      profileColor: "sage",
      description:
        "Your answers suggest patterns associated with hormonal and metabolic imbalances common in PCOS. The recipes and articles below are chosen to support stable blood sugar and reduce the insulin-driven androgen excess that underlies many PCOS symptoms.",
      articles: [
        {
          href: "/pcos",
          title: "PCOS and Insulin Resistance",
          category: "PCOS",
        },
        {
          href: "/learn/nutrition",
          title: "Eating for Metabolic Health",
          category: "Nutrition",
        },
        {
          href: "/learn/what-is-insulin-resistance",
          title: "What Is Insulin Resistance?",
          category: "Insulin Resistance",
        },
      ],
      planHref: "https://insuliniq.lemonsqueezy.com",
    };
  }

  if (hasNAFLD) {
    return {
      profile: "nafld",
      profileLabel: "Liver Metabolic Focus",
      profileColor: "honey",
      description:
        "Your answers suggest patterns associated with metabolic liver health concerns. The recipes and articles below are chosen to reduce dietary factors that drive hepatic fat accumulation.",
      articles: [
        {
          href: "/nafld",
          title: "Fatty Liver Disease and Insulin Resistance",
          category: "NAFLD / MASLD",
        },
        {
          href: "/learn/nutrition",
          title: "Eating for Metabolic Health",
          category: "Nutrition",
        },
        {
          href: "/learn/metabolic-syndrome",
          title: "Metabolic Syndrome Explained",
          category: "Metabolic Syndrome",
        },
      ],
      planHref: "https://insuliniq.lemonsqueezy.com",
    };
  }

  if (metSynFlags >= 2 || goal === "belly_fat") {
    return {
      profile: "metabolic_syndrome",
      profileLabel: "Metabolic Syndrome Focus",
      profileColor: "forest",
      description:
        "Your answers suggest patterns across multiple metabolic systems — blood sugar, blood pressure, and lipids. The recipes and articles below address the root cause: insulin resistance driving the full cluster.",
      articles: [
        {
          href: "/learn/metabolic-syndrome",
          title: "Metabolic Syndrome Explained",
          category: "Metabolic Syndrome",
        },
        {
          href: "/learn/nutrition",
          title: "Eating for Metabolic Health",
          category: "Nutrition",
        },
        {
          href: "/learn/microbiome",
          title: "Your Gut Microbiome and Metabolic Health",
          category: "Gut Microbiome",
        },
      ],
      planHref: "https://insuliniq.lemonsqueezy.com",
    };
  }

  if (hasHighBG || goal === "diabetes_risk") {
    return {
      profile: "prediabetes",
      profileLabel: "Blood Sugar Stabiliser",
      profileColor: "clay",
      description:
        "Your answers suggest patterns associated with blood sugar regulation challenges. The recipes and articles below are chosen to support a lower glycaemic load and better insulin sensitivity.",
      articles: [
        {
          href: "/prediabetes",
          title: "What Is Prediabetes?",
          category: "Prediabetes",
        },
        {
          href: "/learn/nutrition",
          title: "Eating for Metabolic Health",
          category: "Nutrition",
        },
        {
          href: "/learn/what-is-insulin-resistance",
          title: "What Is Insulin Resistance?",
          category: "Insulin Resistance",
        },
      ],
      planHref: "https://insuliniq.lemonsqueezy.com",
    };
  }

  // Default: general IR / wellness
  return {
    profile: "insulin_resistance",
    profileLabel: "Metabolic Health Foundations",
    profileColor: "forest",
    description:
      "Your answers suggest you're building awareness of how insulin resistance affects energy, weight, and long-term health. The resources below are your best starting point for understanding and improving your metabolic health.",
    articles: [
      {
        href: "/learn/what-is-insulin-resistance",
        title: "What Is Insulin Resistance?",
        category: "Insulin Resistance",
      },
      {
        href: "/learn/nutrition",
        title: "Eating for Metabolic Health",
        category: "Nutrition",
      },
      {
        href: "/learn/microbiome",
        title: "Your Gut Microbiome and Metabolic Health",
        category: "Gut Microbiome",
      },
    ],
    planHref: "https://insuliniq.lemonsqueezy.com",
  };
}
