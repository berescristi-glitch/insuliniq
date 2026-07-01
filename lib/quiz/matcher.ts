// Pure profile-matching logic — no imports from Next.js or Supabase.
// Sprint 6 refactor: interfaces and profile constants moved to profile-content.ts.
// This file re-exports interfaces for backward compatibility and retains
// matchProfile() + getSafetyNotice() unchanged.

import type { QuizAnswers, MetabolicProfile } from "./types";
import {
  PCOS_RESULT,
  NAFLD_RESULT,
  METABOLIC_SYNDROME_RESULT,
  PREDIABETES_RESULT,
  INSULIN_RESISTANCE_RESULT,
} from "./profile-content";

// ── Re-exports for backward compatibility ─────────────────────────────────────
// All existing imports of these types from "@/lib/quiz/matcher" continue to work.
export type { ArticleRef, FrictionPoint, PlanDay, MatchResult } from "./profile-content";

// ── Safety notice (v1) ────────────────────────────────────────────────────────

export function getSafetyNotice(answers: QuizAnswers): string | null {
  const flags = answers.safetyFlags;
  if (!flags || flags.length === 0) return null;

  if (flags.includes("type1_diabetes") || flags.includes("takes_insulin")) {
    return "You indicated you have type 1 diabetes or take insulin. Dietary changes — especially lower-carbohydrate approaches — can significantly affect your insulin requirements and hypoglycaemia risk. Please discuss any meal plan with your diabetes care team before making changes. The educational content on this platform is not a substitute for individualised medical nutrition therapy.";
  }
  if (flags.includes("hypoglycemia_risk_medication")) {
    return "You indicated you take medication that can cause low blood sugar. Some dietary changes — particularly reducing carbohydrate intake — can increase hypoglycaemia risk with certain medications (e.g. sulfonylureas). Please speak with your prescribing doctor before significantly changing your diet.";
  }
  if (flags.includes("pregnant") || flags.includes("breastfeeding")) {
    return "You indicated you are pregnant or breastfeeding. Nutritional requirements during pregnancy and breastfeeding are specific and differ from general metabolic health guidance. Please consult a registered dietitian or your midwife / OB before making dietary changes.";
  }
  if (flags.includes("advanced_liver_disease")) {
    return "You indicated you have advanced liver disease. Advanced liver disease (e.g. cirrhosis) has specific protein and sodium requirements that differ significantly from general nutrition guidance for fatty liver. Please work with a hepatologist or specialist dietitian before making dietary changes.";
  }
  if (flags.includes("kidney_disease")) {
    return "You indicated you have kidney disease. Kidney disease involves specific restrictions on protein, potassium, and phosphorus that can conflict with general metabolic health guidance. Please consult a renal dietitian before making significant dietary changes.";
  }
  if (flags.includes("eating_disorder_history")) {
    return "You indicated a history of eating disorders. Some approaches commonly used in metabolic health — calorie tracking, meal timing, food restriction — can be triggering or harmful for people with a history of disordered eating. Please work with a healthcare provider experienced in both eating disorders and nutrition before applying any structured meal plan.";
  }
  if (flags.includes("under_18")) {
    return "You indicated you are under 18. The content on this platform is designed for adults. If you are under 18 and have health concerns, please speak with a parent or guardian and a paediatric healthcare provider.";
  }

  return "Some of your answers suggest it's worth speaking with a doctor or qualified healthcare provider before starting any meal plan — including ours. Your educational profile below is safe to read. We simply recommend professional supervision before making significant dietary changes.";
}

// ── matchProfile (v1 — unchanged) ─────────────────────────────────────────────

// Import the re-exported MatchResult type for the return annotation
import type { MatchResult } from "./profile-content";

export function matchProfile(answers: QuizAnswers): MatchResult {
  const { goal, symptoms } = answers;

  const hasPCOS =
    goal === "pcos" ||
    symptoms.includes("irregular_periods") ||
    symptoms.includes("acne_or_hair_growth");

  const hasNAFLD =
    goal === "liver_health" || symptoms.includes("fatty_liver");

  const hasHighBP  = symptoms.includes("high_blood_pressure");
  const hasHighTrig = symptoms.includes("high_triglycerides");
  const hasHighBG  = symptoms.includes("high_blood_sugar");

  const metSynFlags = [
    hasHighBP,
    hasHighTrig,
    hasHighBG,
    symptoms.includes("dark_skin_patches"),
  ].filter(Boolean).length;

  // Priority order: PCOS > NAFLD > MetSyn > Prediabetes > default IR
  if (hasPCOS && !hasNAFLD) return PCOS_RESULT;
  if (hasNAFLD)              return NAFLD_RESULT;
  if (metSynFlags >= 2 || goal === "belly_fat") return METABOLIC_SYNDROME_RESULT;
  if (hasHighBG || goal === "diabetes_risk")    return PREDIABETES_RESULT;
  return INSULIN_RESISTANCE_RESULT;
}
