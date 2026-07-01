# Quiz v2 Data Schema — InsulinIQ

> Date: 2026-07-01  
> Philosophy: Collect minimum necessary data. Store health data with clear purpose. Minimise sensitive data retention. Enable easy deletion.

---

## TypeScript Types — lib/quiz/types-v2.ts

```typescript
// lib/quiz/types-v2.ts
// Quiz v2 type definitions — additive extension of v1 types.
// v1 types (QuizAnswers, MetabolicProfile etc.) remain in types.ts for backward compat.

import type { MetabolicProfile, SafetyFlag, Allergen, DietPattern,
              CookingTime, CookingSkill, AgeRange, Region, QuizGoal } from "./types";

// ── Extended goal (adds weight_loss_friction) ─────────────────────────────
export type QuizGoalV2 = QuizGoal | "weight_loss_friction";

// ── Extended metabolic profile ─────────────────────────────────────────────
export type MetabolicProfileV2 = MetabolicProfile | "weight_loss_friction";

// ── Biological sex ─────────────────────────────────────────────────────────
export type BiologicalSex = "female" | "male" | "intersex" | "prefer_not_to_say";

// ── Known conditions (confirmed diagnoses, self-reported) ──────────────────
// Prefix dx_ to distinguish from symptom flags
export type KnownCondition =
  | "dx_ir"
  | "dx_prediabetes"
  | "dx_t2d"
  | "dx_pcos"
  | "dx_nafld"
  | "dx_metabolic_syndrome"
  | "dx_hypothyroid"
  | "dx_hypertension"
  | "dx_dyslipidemia"
  | "dx_sleep_apnea"
  | "none_of_above"
  | "not_tested";

// ── Extended symptoms ──────────────────────────────────────────────────────
export type SymptomV2 =
  | "high_blood_sugar"
  | "high_blood_pressure"
  | "irregular_periods"
  | "acne_or_hair_growth"
  | "dark_skin_patches"
  | "high_triglycerides"
  | "energy_crashes"
  | "cravings_sugary"        // renamed from implicit "cravings"
  | "weight_resistant"       // NEW
  | "post_meal_fatigue"      // NEW
  | "frequent_hunger"        // NEW
  | "sleep_issues"           // NEW
  | "abdominal_weight"       // NEW
  | "skin_tags"              // NEW
  | "family_history"         // extracted from family_history_diabetes
  | "none";

// ── Extended safety flags ──────────────────────────────────────────────────
export type SafeFlagV2 = SafetyFlag
  | "heart_disease"          // NEW
  | "thyroid_condition"      // NEW
  | "active_cancer_treatment"; // NEW

// ── Budget per country ─────────────────────────────────────────────────────
export type BudgetUS = "under_60" | "60_100" | "100_150" | "over_150" | "prefer_not_to_say";
export type BudgetUK = "under_40" | "40_70" | "70_100" | "over_100" | "prefer_not_to_say";
export type BudgetAU = "under_70" | "70_120" | "120_180" | "over_180" | "prefer_not_to_say";
export type BudgetOther = "low" | "moderate" | "no_constraint" | "prefer_not_to_say";

export type WeeklyBudget =
  | { country: "US"; tier: BudgetUS }
  | { country: "UK"; tier: BudgetUK }
  | { country: "AU"; tier: BudgetAU }
  | { country: "Other"; tier: BudgetOther }
  | null;

// ── Profile confidence ─────────────────────────────────────────────────────
export type ProfileConfidence = "high" | "medium" | "low";

// ── Quick Quiz answers (v2) ────────────────────────────────────────────────
// Extends v1 QuizAnswers; backward compatible
export interface QuizAnswersV2 {
  // --- From v1 (preserved, some types widened) ---
  goal: QuizGoalV2 | null;
  region: Region | null;
  symptoms: SymptomV2[];
  dietPattern: DietPattern | null;
  allergens: Allergen[];
  cookingTime: CookingTime | null;
  cookingSkill: CookingSkill | null;
  ageRange: AgeRange | null;
  safetyFlags: SafeFlagV2[];
  email: string | null;

  // --- New in v2 (Quick Quiz) ---
  sex: BiologicalSex | null;
  knownConditions: KnownCondition[];
  weeklyBudget: WeeklyBudget;
  healthDataConsent: boolean;           // A01 — must be true to submit
  marketingConsent: boolean;            // L01 — separate from health consent

  // --- Computed (not collected directly) ---
  profileConfidence?: ProfileConfidence;
}

// ── Advanced Quiz answers ──────────────────────────────────────────────────
// Stored separately, linked by session_id

export interface QuizAnswersAdvanced {
  sessionId: string;

  // Section M — Condition Deep Dive
  pcosDiagnosisAge?: string | null;
  pcosYearsDiagnosed?: string | null;
  menstrualRegularity?: string | null;
  androgenMarkersElevated?: string[] | null;
  liverEnzymesAbnormal?: string[] | null;
  alcoholFrequency?: string | null;
  labValuesAvailable?: string[] | null;
  doctorRecommendedLifestyle?: string | null;

  // Section N — Anthropometrics (all optional, all sensitive)
  heightCm?: number | null;
  weightKg?: number | null;
  waistCm?: number | null;
  heightFtIn?: string | null;          // "5ft 8in" — US only
  weightLbs?: number | null;           // US only

  // Section O — Lab Values (all optional)
  fastingGlucoseMgDl?: number | null;
  fastingGlucoseMmol?: number | null;
  hba1cPercent?: number | null;
  fastingInsulinUiuMl?: number | null;
  homaIr?: number | null;
  triglycerides?: number | null;
  hdlMgDl?: number | null;
  altUl?: number | null;
  tshMiuL?: number | null;

  // Section P — Eating Behavior
  mealsPerDay?: string | null;
  cravingsTimingPeak?: string[] | null;
  eatingSpeed?: string | null;
  firstMealTime?: string | null;

  // Section Q — Sleep & Stress
  sleepHoursPerNight?: string | null;
  stressLevel?: string | null;

  // Section R — Physical Activity
  activityLevel?: string | null;
  exerciseTypes?: string[] | null;

  // Section S — Practical Meal Planning
  cookingForGroup?: string | null;
  eatingOutFrequency?: string | null;
  batchCooking?: string | null;
  hardestMeal?: string | null;

  // Section T — Food Preferences
  dislikedFoodsFreeText?: string | null;     // ≤200 chars, optional
  culturalFoodPreferences?: string[] | null;
  likedFoodGroups?: string[] | null;

  // Section U — Previous Approaches
  previousDietsAttempted?: string[] | null;
  dietingBarriers?: string[] | null;

  // Section V — Readiness
  readinessStage?: string | null;

  // Section W — Output Preferences
  outputPreferences?: string[] | null;
}

// ── Meal Plan Constraints (computed from answers) ──────────────────────────
// Computed server-side; not stored directly; regenerated when needed

export interface MealPlanConstraints {
  country: "US" | "UK" | "AU" | "Other";
  subregion?: string;
  allergens: Allergen[];
  dietPattern: DietPattern | null;
  culturalRestrictions: string[];
  dislikedFoods: string[];
  weeklyBudgetTier: string;
  maxCookingTimeMinutes: 20 | 40 | 60 | 90;
  cookingSkill: CookingSkill;
  cookingForGroup: string;
  batchCookingEnabled: boolean;
  mealsPerDay: 2 | 3 | "3+snacks" | "irregular";
  proteinFocusLevel: "high" | "moderate";   // high for most profiles
  fibreEmphasis: boolean;
  carbModeration: boolean;                   // not "low carb" — moderation
  vegetarianVariants: boolean;
  veganVariants: boolean;
  glutenFreeRequired: boolean;
  dairyFreeRequired: boolean;
}

// ── Nurture Segment (for email system) ───────────────────────────────────
export interface NurtureSegment {
  metabolicProfile: MetabolicProfileV2;
  goal: QuizGoalV2 | null;
  region: string | null;
  hasSafetyFlags: boolean;
  allergens: Allergen[];
  dietPattern: DietPattern | null;
  readinessStage?: string | null;
  primaryBarrier?: string | null;
}

// ── Quiz v2 Result ─────────────────────────────────────────────────────────
export interface QuizV2Result {
  sessionId: string;
  profile: MetabolicProfileV2;
  profileConfidence: ProfileConfidence;
  profileLabel: string;
  profileColor: "forest" | "sage" | "clay" | "honey";
  scores: {
    insulinSensitivity: "low_attention" | "moderate_attention" | "elevated_attention";
    bloodSugarStability: "low_attention" | "moderate_attention" | "elevated_attention";
    lifestyleFriction: "low_attention" | "moderate_attention" | "elevated_attention";
    mealStructure?: "well_structured" | "some_gaps" | "less_structured"; // Advanced only
  };
  personalizationCompleteness: number;  // 0–100, internal use only
  safetyNoticeText: string | null;
  mealPlanConstraints: MealPlanConstraints;
  nurtureSegment: NurtureSegment;
}

// ── Personalization Completeness ──────────────────────────────────────────
export interface PersonalizationCompleteness {
  quickQuizComplete: boolean;
  conditionBranchComplete: boolean;
  anthropometricsProvided: boolean;
  labValuesProvided: boolean;
  advancedComplete: boolean;
  score: number; // 0–100
}
```

---

## Database Schema Proposals

### Existing: `quiz_results` (extend, don't replace)

```sql
-- Add to quiz_results table
ALTER TABLE public.quiz_results
  ADD COLUMN IF NOT EXISTS profile_confidence TEXT,    -- 'high' | 'medium' | 'low'
  ADD COLUMN IF NOT EXISTS quiz_version       TEXT DEFAULT 'v1';  -- 'v1' | 'v2'
```

### New: `quiz_results_advanced`

```sql
CREATE TABLE IF NOT EXISTS public.quiz_results_advanced (
  id                           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id                   TEXT NOT NULL REFERENCES public.quiz_results(session_id),
  
  -- Condition deep dive
  pcos_diagnosis_duration      TEXT,
  menstrual_regularity         TEXT,
  androgen_markers_elevated    TEXT[],
  liver_enzymes_abnormal       TEXT[],
  alcohol_frequency            TEXT,
  lab_values_available         TEXT[],
  doctor_recommended_lifestyle TEXT,
  
  -- Anthropometrics (sensitive — minimise)
  height_cm                    NUMERIC(5,1),
  weight_kg                    NUMERIC(5,1),
  waist_cm                     NUMERIC(5,1),
  
  -- Lab values (very sensitive — special category data)
  fasting_glucose_mg_dl        NUMERIC(6,1),
  hba1c_percent                NUMERIC(4,1),
  fasting_insulin_uiu_ml       NUMERIC(6,1),
  homa_ir                      NUMERIC(4,2),
  triglycerides_mg_dl          NUMERIC(6,1),
  hdl_mg_dl                    NUMERIC(6,1),
  alt_ul                       NUMERIC(6,1),
  tsh_miu_l                    NUMERIC(6,2),
  
  -- Eating behavior
  meals_per_day                TEXT,
  cravings_timing_peak         TEXT[],
  eating_speed                 TEXT,
  first_meal_time              TEXT,
  
  -- Sleep & stress
  sleep_hours                  TEXT,
  stress_level                 TEXT,
  
  -- Activity
  activity_level               TEXT,
  exercise_types               TEXT[],
  
  -- Practical
  cooking_for_group            TEXT,
  eating_out_frequency         TEXT,
  batch_cooking                TEXT,
  hardest_meal                 TEXT,
  
  -- Preferences
  disliked_foods_text          TEXT,           -- max 200 chars
  cultural_food_preferences    TEXT[],
  liked_food_groups            TEXT[],
  
  -- Previous approaches
  previous_diets               TEXT[],
  dieting_barriers             TEXT[],
  
  -- Readiness
  readiness_stage              TEXT,
  output_preferences           TEXT[],
  
  -- Metadata
  created_at                   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at                   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- RLS: same session_id-keyed pattern as quiz_results
CREATE INDEX IF NOT EXISTS idx_quiz_advanced_session 
  ON public.quiz_results_advanced (session_id);
```

### New: `meal_plan_constraints` (computed cache)

```sql
CREATE TABLE IF NOT EXISTS public.meal_plan_constraints (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id       TEXT NOT NULL REFERENCES public.quiz_results(session_id),
  constraints_json JSONB NOT NULL,  -- MealPlanConstraints serialized
  computed_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  quiz_version     TEXT NOT NULL DEFAULT 'v2'
);
```

---

## Data Sensitivity Classification

| Data field | Sensitivity | GDPR category | Retention | User can delete? |
|-----------|------------|--------------|-----------|-----------------|
| email | Medium | Personal data | Until unsubscribed | Yes |
| goal | Low | Personal data | Session | Yes |
| region/country | Low | Personal data | Session | Yes |
| symptoms | High | Health-adjacent | Session | Yes |
| safetyFlags | Special category | Art. 9 | Session | Yes — immediately |
| knownConditions | Special category | Art. 9 | Session | Yes — immediately |
| sex | Medium | Personal data | Session | Yes |
| age range | Low | Personal data | Session | Yes |
| allergens | Medium | Health-adjacent | Session | Yes |
| anthropometrics | High | Health-adjacent | Session | Yes — immediately |
| lab values | Special category | Art. 9 | Session | Yes — immediately |
| dislikedFoodsFreeText | Low | Personal data | Session | Yes |
| eatingDisorder (safetyFlag) | Special category | Art. 9 | Session | Yes — immediately |

---

## Data Minimisation Rules

1. **Lab values:** Never store absolute values in any marketing system. Only store in `quiz_results_advanced` (health data table, not newsletter).
2. **Anthropometrics:** Store only in `quiz_results_advanced`. Never in `newsletter_subscribers`. Never in email content.
3. **Free text (disliked foods):** Cap at 200 characters. Sanitize before storage (strip HTML, strip PII patterns).
4. **Safety flags:** Store in `quiz_results.answers` and `newsletter_subscribers.has_safety_flags` (boolean only, not the specific flags). Specific flags are NOT stored in email tables.
5. **Sex:** Not stored in `newsletter_subscribers`. Used only for quiz routing; stored in `quiz_results.answers`.

---

## Data Deletion Flow

When user requests data deletion (`DELETE /api/user/delete-data`):
1. Delete from `quiz_results` WHERE session_id matches user sessions
2. Delete from `quiz_results_advanced` WHERE session_id in scope
3. Delete from `meal_plan_constraints` WHERE session_id in scope
4. Set `unsubscribed_at = NOW()` in `newsletter_subscribers` (soft delete — keep for audit trail)
5. Cascade delete from `subscriptions` (or transfer to anonymized record)
6. Delete from `users` table
7. Log deletion event (anonymized — no PII in log, just deletion timestamp and user_id hash)

**Retention after deletion:** 0 days for health data. 30 days for payment records (legal requirement). Permanent for deletion log (anonymized).
