// All discriminated union types for the quiz. These are shared between the
// client stepper and the server-side matcher — keep them import-side-effect-free.

export type QuizGoal =
  | "blood_sugar"
  | "belly_fat"
  | "pcos"
  | "liver_health"
  | "diabetes_risk"
  | "just_learning";

export type Country = "US" | "UK" | "AU";

export type USRegion =
  | "South"
  | "Midwest"
  | "Northeast"
  | "Southwest"
  | "West Coast"
  | "Pacific Northwest";

export type UKRegion =
  | "England North"
  | "England South"
  | "Scotland"
  | "Wales"
  | "Northern Ireland";

export type AUState = "NSW" | "VIC" | "QLD" | "WA" | "SA";

// Discriminated union so TypeScript narrows subregion by country
export type Region =
  | { country: "US"; subregion: USRegion }
  | { country: "UK"; subregion: UKRegion }
  | { country: "AU"; subregion: AUState }
  | { country: "Other" };

export type Symptom =
  | "high_blood_sugar"
  | "high_blood_pressure"
  | "irregular_periods"
  | "acne_or_hair_growth"
  | "fatty_liver"
  | "high_triglycerides"
  | "dark_skin_patches"
  | "family_history_diabetes"
  | "energy_crashes"
  | "none";

export type DietPattern =
  | "no_particular"
  | "trying_healthier"
  | "low_carb"
  | "mediterranean"
  | "vegetarian"
  | "vegan";

export type Allergen =
  | "gluten"
  | "dairy"
  | "eggs"
  | "peanuts"
  | "tree_nuts"
  | "soy"
  | "fish"
  | "shellfish"
  | "sesame"
  | "lupin"
  | "mustard"
  | "sulphites"
  | "halal"
  | "kosher";

export type CookingTime = "under_20" | "20_40" | "40_60" | "60_plus";
export type CookingSkill = "beginner" | "basics" | "confident" | "experimental";

export type AgeRange =
  | "under_25"
  | "25_34"
  | "35_44"
  | "45_54"
  | "55_64"
  | "65_plus";

// Safety-screening flags (CLAUDE.md §16) — never used to block/diagnose, only to
// surface a "speak with a doctor before any meal plan" notice on the results page.
export type SafetyFlag =
  | "type1_diabetes"
  | "pregnant"
  | "breastfeeding"
  | "kidney_disease"
  | "advanced_liver_disease"
  | "eating_disorder_history"
  | "takes_insulin"
  | "hypoglycemia_risk_medication"
  | "under_18";

export type MetabolicProfile =
  | "pcos"
  | "prediabetes"
  | "nafld"
  | "metabolic_syndrome"
  | "insulin_resistance"
  | "general_wellness";

export interface QuizAnswers {
  goal: QuizGoal | null;
  region: Region | null;
  symptoms: Symptom[];
  dietPattern: DietPattern | null;
  allergens: Allergen[];
  cookingTime: CookingTime | null;
  cookingSkill: CookingSkill | null;
  ageRange: AgeRange | null;
  safetyFlags: SafetyFlag[];
  email: string | null;
}

// 8 = safety screening step, 9 = email gate step
export type QuizStep = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
