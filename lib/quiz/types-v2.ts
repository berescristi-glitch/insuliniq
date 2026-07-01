// Quiz v2 types — additive extension of v1 types (lib/quiz/types.ts).
// Never modify types.ts directly — import from there and extend here.
// These types serve the /quiz-v2 shadow route only until v2 replaces v1.

import type {
  Region,
  DietPattern,
  Allergen,
  CookingTime,
  CookingSkill,
  AgeRange,
  MetabolicProfile,
} from "./types";

// Re-export unchanged v1 types so v2 components import from one place
export type { Region, DietPattern, Allergen, CookingTime, CookingSkill, AgeRange };

// ── Goal (v2 adds weight_management) ─────────────────────────────────────────
export type QuizGoalV2 =
  | "blood_sugar"
  | "belly_fat"
  | "pcos"
  | "liver_health"
  | "diabetes_risk"
  | "weight_management"   // NEW in v2 — maps to weight_loss_friction profile
  | "just_learning";

// ── Biological sex ────────────────────────────────────────────────────────────
// Critical for PCOS routing. always optional — prefer_not_to_say is always valid.
export type BiologicalSex = "female" | "male" | "intersex" | "prefer_not_to_say";

// ── Known conditions (self-reported confirmed diagnoses) ──────────────────────
// Prefix dx_ clearly distinguishes confirmed dx from suspected symptoms.
export type KnownCondition =
  | "dx_ir"               // insulin resistance (told by HCP)
  | "dx_prediabetes"      // prediabetes / impaired fasting glucose
  | "dx_t2d"              // type 2 diabetes
  | "dx_pcos"             // polycystic ovary syndrome
  | "dx_nafld"            // fatty liver / NAFLD / MASLD
  | "dx_metabolic_syndrome"
  | "dx_hypothyroid"      // underactive thyroid
  | "dx_hypertension"     // high blood pressure
  | "dx_dyslipidemia"     // high cholesterol / high triglycerides
  | "dx_sleep_apnea"
  | "none_of_above"
  | "not_tested";         // "I haven't had relevant testing / I don't know"

// ── Extended safety flags ─────────────────────────────────────────────────────
// v1 SafetyFlag + 3 new flags (heart_disease, thyroid_condition, active_cancer_treatment)
export type SafetyFlagV2 =
  | "type1_diabetes"
  | "takes_insulin"
  | "hypoglycemia_risk_medication"
  | "pregnant"
  | "breastfeeding"
  | "kidney_disease"
  | "advanced_liver_disease"
  | "eating_disorder_history"
  | "under_18"
  | "heart_disease"           // NEW
  | "thyroid_condition"       // NEW
  | "active_cancer_treatment" // NEW
  | "none";

// ── Extended symptoms (v2 adds 6 new symptoms) ───────────────────────────────
export type SymptomV2 =
  | "high_blood_sugar"
  | "high_blood_pressure"
  | "irregular_periods"
  | "acne_or_hair_growth"
  | "dark_skin_patches"     // acanthosis nigricans
  | "high_triglycerides"
  | "energy_crashes"
  | "cravings_sugary"       // NEW: renamed from implicit "cravings"
  | "weight_resistant"      // NEW: difficulty losing weight despite trying
  | "post_meal_fatigue"     // NEW: very tired/foggy after eating
  | "frequent_hunger"       // NEW: hungry again within 2 hours
  | "sleep_issues"          // NEW: poor sleep quality
  | "abdominal_weight"      // NEW: most weight around belly
  | "skin_tags"             // NEW: small skin tags (acrochordon)
  | "family_history"        // combines old family_history_diabetes
  | "none";

// ── Weekly food budget (conditional per country) ──────────────────────────────
export type BudgetTierUS = "under_60" | "60_100" | "100_150" | "over_150" | "prefer_not_to_say";
export type BudgetTierUK = "under_40" | "40_70"  | "70_100"  | "over_100"  | "prefer_not_to_say";
export type BudgetTierAU = "under_70" | "70_120" | "120_180" | "over_180"  | "prefer_not_to_say";
export type BudgetTierOther = "low" | "moderate" | "no_constraint" | "prefer_not_to_say";

export type WeeklyBudget =
  | { country: "US";    tier: BudgetTierUS }
  | { country: "UK";    tier: BudgetTierUK }
  | { country: "AU";    tier: BudgetTierAU }
  | { country: "Other"; tier: BudgetTierOther }
  | null;

// ── Metabolic profile (v2 adds weight_loss_friction) ─────────────────────────
export type MetabolicProfileV2 = MetabolicProfile | "weight_loss_friction";

// ── Profile confidence ────────────────────────────────────────────────────────
// Reflects how complete and consistent the quiz answers are.
// NOT a clinical certainty — must always be displayed with that disclaimer.
export type ProfileConfidence = "high" | "moderate" | "low";

// ── Quick Quiz v2 answers ─────────────────────────────────────────────────────
export interface QuizAnswersV2 {
  // Step 1 — consent (required: must be true before any health question)
  healthDataConsent: boolean;

  // Step 2 — goal
  goal: QuizGoalV2 | null;

  // Step 3 — region (same structure as v1)
  region: Region | null;

  // Step 4 — demographics
  ageRange: AgeRange | null;
  biologicalSex: BiologicalSex | null; // null = not answered yet; prefer_not_to_say when explicitly skipped

  // Step 5 — safety screening (v2 extended, includes "none")
  safetyFlags: SafetyFlagV2[];

  // Step 6 — known conditions
  knownConditions: KnownCondition[];

  // Step 7 — symptoms & daily signals
  symptoms: SymptomV2[];

  // Step 8 — eating pattern
  dietPattern: DietPattern | null;

  // Step 9 — allergens & restrictions
  allergens: Allergen[];

  // Step 10 — cooking
  cookingTime: CookingTime | null;
  cookingSkill: CookingSkill | null;

  // Step 11 — budget
  weeklyBudget: WeeklyBudget;

  // Step 12 — email gate
  email: string | null;
  marketingConsent: boolean;
}

// ── v2 step type ──────────────────────────────────────────────────────────────
export type QuizV2Step = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

// ── v2 result (extends v1 MatchResult with v2 metadata) ──────────────────────
// Import MatchResult from profile-content (the authoritative source) to avoid
// any potential circular dependency via matcher.ts.
import type { MatchResult } from "./profile-content";

export interface MatchResultV2 extends Omit<MatchResult, "profile"> {
  profile: MetabolicProfileV2;
  profileConfidence: ProfileConfidence;
  quizVersion: "v2";
  personalizationNote?: string; // derived from answers (region, allergens, cooking time)
}
