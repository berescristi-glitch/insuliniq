// Educational score derived purely from QuizAnswers.
// These are NOT clinical measurements — they are educational pattern indicators
// used to personalise the results page. Always display with a non-clinical disclaimer.

import type { QuizAnswers } from "./types";

export type SignalLevel = "low_pressure" | "moderate_pressure" | "elevated_attention";

export interface EducationalScore {
  insulinSensitivity: SignalLevel;
  bloodSugarStability: SignalLevel;
  lifestyleFriction: SignalLevel;
}

// User-facing labels — intentionally non-clinical ("attention" not "risk")
export const SIGNAL_LABEL: Record<SignalLevel, string> = {
  low_pressure: "Low Attention",
  moderate_pressure: "Moderate Attention",
  elevated_attention: "Higher Attention",
};

// String widths for inline style (Tailwind can't do dynamic widths safely)
export const SIGNAL_WIDTH: Record<SignalLevel, string> = {
  low_pressure: "30%",
  moderate_pressure: "60%",
  elevated_attention: "88%",
};

export function computeEducationalScore(answers: QuizAnswers): EducationalScore {
  const { symptoms, goal, safetyFlags, cookingTime, allergens, dietPattern, ageRange } = answers;

  // ── Insulin Sensitivity Signal ───────────────────────────────────────────────
  // Pattern-matches self-reported IR-adjacent signals (not a clinical marker)
  const irSignals = [
    symptoms.includes("high_blood_sugar"),
    symptoms.includes("dark_skin_patches"),
    symptoms.includes("high_triglycerides"),
    symptoms.includes("energy_crashes"),
    goal === "diabetes_risk",
    goal === "belly_fat",
    symptoms.includes("high_blood_pressure"),
  ].filter(Boolean).length;

  const insulinSensitivity: SignalLevel =
    irSignals >= 3 ? "elevated_attention" :
    irSignals >= 1 ? "moderate_pressure" :
    "low_pressure";

  // ── Blood Sugar Stability Signal ─────────────────────────────────────────────
  const bgSignals = [
    symptoms.includes("high_blood_sugar"),
    symptoms.includes("energy_crashes"),
    goal === "blood_sugar",
    goal === "diabetes_risk",
    safetyFlags.includes("type1_diabetes"),
    safetyFlags.includes("hypoglycemia_risk_medication"),
  ].filter(Boolean).length;

  const bloodSugarStability: SignalLevel =
    bgSignals >= 3 ? "elevated_attention" :
    bgSignals >= 1 ? "moderate_pressure" :
    "low_pressure";

  // ── Lifestyle Friction Signal ────────────────────────────────────────────────
  // Measures how many practical constraints the user has flagged that can make
  // dietary change harder: limited cooking time, allergen restrictions, no
  // established dietary pattern, age-related context, family history.
  // Renamed from hormonalBalance to better reflect ALL profiles, not just PCOS.
  const frictionSignals = [
    cookingTime === "under_20",
    cookingTime === "20_40" && allergens.length > 0,
    allergens.length >= 2,
    allergens.length >= 1 && dietPattern === "no_particular",
    dietPattern === "no_particular" && goal !== "just_learning",
    ageRange === "65_plus",
    symptoms.includes("family_history_diabetes"),
  ].filter(Boolean).length;

  const lifestyleFriction: SignalLevel =
    frictionSignals >= 3 ? "elevated_attention" :
    frictionSignals >= 1 ? "moderate_pressure" :
    "low_pressure";

  return { insulinSensitivity, bloodSugarStability, lifestyleFriction };
}
