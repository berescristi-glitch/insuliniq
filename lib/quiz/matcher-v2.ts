// Quiz v2 matcher — Sprint 6 refactor.
// No longer uses require("./matcher") — imports profile content directly from
// profile-content.ts, which defines interfaces and all profile constants.
//
// Sprint 5 had: require("./matcher") + synthetic v1 answer construction to get
// v1 profile content. Sprint 6 replaces that with a direct PROFILE_CONTENT lookup.

import type { QuizAnswersV2, MetabolicProfileV2, ProfileConfidence, MatchResultV2 } from "./types-v2";
import {
  PCOS_RESULT,
  NAFLD_RESULT,
  METABOLIC_SYNDROME_RESULT,
  PREDIABETES_RESULT,
  INSULIN_RESISTANCE_RESULT,
  WEIGHT_LOSS_FRICTION_RESULT,
  GENERAL_WELLNESS_RESULT,
  PROFILE_CONTENT,
} from "./profile-content";
import type { ProfileContentBase } from "./profile-content";

// ── Helpers ───────────────────────────────────────────────────────────────────

function hasAnyOf(arr: string[], values: string[]): boolean {
  return values.some((v) => arr.includes(v));
}

function countOf(arr: string[], values: string[]): number {
  return values.filter((v) => arr.includes(v)).length;
}

// ── Personalisation note ──────────────────────────────────────────────────────

const ALLERGEN_LABELS: Record<string, string> = {
  gluten: "gluten-free", dairy: "dairy-free", eggs: "egg-free", peanuts: "peanut-free",
  tree_nuts: "nut-free", soy: "soy-free", fish: "fish-free", shellfish: "shellfish-free",
  halal: "halal", kosher: "kosher",
};

const COOKING_TIME_LABELS: Record<string, string> = {
  under_20: "under 20 minutes to cook", "20_40": "20–40 minutes to cook",
  "40_60": "40–60 minutes to cook", "60_plus": "over 60 minutes to cook",
};

function buildPersonalizationNote(answers: QuizAnswersV2): string | undefined {
  const parts: string[] = [];

  if (answers.region) {
    const c = answers.region.country;
    if (c === "US") parts.push("United States");
    else if (c === "UK") parts.push("UK");
    else if (c === "AU") parts.push("Australia");
  }
  if (answers.cookingTime && COOKING_TIME_LABELS[answers.cookingTime]) {
    parts.push(COOKING_TIME_LABELS[answers.cookingTime]);
  }
  if (answers.allergens.length > 0) {
    const labels = answers.allergens
      .map((a) => ALLERGEN_LABELS[a] ?? a)
      .slice(0, 2);
    parts.push(`${labels.join(" and ")} needs`);
  }
  if (answers.weeklyBudget?.tier) {
    const tier = answers.weeklyBudget.tier;
    if (["under_60", "under_40", "under_70", "low"].includes(tier)) {
      parts.push("a budget-conscious approach");
    }
  }

  if (parts.length < 2) return undefined;
  const [first, ...rest] = parts;
  return `Because you selected ${first}, with ${rest.join(", ")}, your plan prioritises practical, accessible meals that fit your real life — not an idealised routine.`;
}

// ── Profile confidence ────────────────────────────────────────────────────────

type ProfileKey = string; // allows weight_loss_friction and general_wellness

function computeConfidence(
  answers: QuizAnswersV2,
  profile: ProfileKey
): ProfileConfidence {
  let score = 0;

  // Confirmed diagnosis aligned with profile — strongest signal
  const conditionMap: Record<string, string[]> = {
    pcos:                ["dx_pcos"],
    nafld:               ["dx_nafld"],
    prediabetes:         ["dx_prediabetes", "dx_t2d"],
    metabolic_syndrome:  ["dx_metabolic_syndrome"],
    insulin_resistance:  ["dx_ir"],
    weight_loss_friction:["dx_ir"],
    general_wellness:    [],
  };
  if (hasAnyOf(answers.knownConditions, conditionMap[profile] ?? [])) score += 3;

  // Goal aligned with profile
  const goalMap: Record<string, string[]> = {
    pcos:                ["pcos"],
    nafld:               ["liver_health"],
    prediabetes:         ["diabetes_risk", "blood_sugar"],
    metabolic_syndrome:  ["belly_fat"],
    insulin_resistance:  ["blood_sugar", "just_learning"],
    weight_loss_friction:["weight_management", "belly_fat"],
    general_wellness:    ["just_learning"],
  };
  if (hasAnyOf([answers.goal ?? ""], goalMap[profile] ?? [])) score += 2;

  // Supporting symptoms
  if (answers.symptoms.length >= 2 && !answers.symptoms.includes("none")) score += 1;

  // Multiple safety flags increase complexity slightly
  if (answers.safetyFlags.length > 1 && !answers.safetyFlags.includes("none")) score -= 1;

  // Low data penalties
  const unknownCount = [
    answers.ageRange === null,
    answers.biologicalSex === null || answers.biologicalSex === "prefer_not_to_say",
    answers.symptoms.includes("none") || answers.symptoms.length === 0,
    answers.knownConditions.includes("not_tested"),
  ].filter(Boolean).length;
  score -= unknownCount;

  if (score >= 4) return "high";
  if (score >= 2) return "moderate";
  return "low";
}

// ── Main matcher ──────────────────────────────────────────────────────────────

export function matchProfileV2(answers: QuizAnswersV2): MatchResultV2 {
  const { goal, symptoms, knownConditions, biologicalSex, safetyFlags } = answers;

  // ── PCOS sex gate ─────────────────────────────────────────────────────────
  // PCOS can only be assigned if sex is not male. prefer_not_to_say allows PCOS
  // but confidence is capped at "moderate" when confirmed dx is absent (see below).
  const sexAllowsPCOS = biologicalSex !== "male";

  const pcosFromConditions = knownConditions.includes("dx_pcos");
  const pcosFromSymptoms =
    symptoms.includes("irregular_periods") || symptoms.includes("acne_or_hair_growth");
  const pcosFromGoal = goal === "pcos";

  const hasPCOS = sexAllowsPCOS && (pcosFromConditions || pcosFromSymptoms || pcosFromGoal);

  // ── NAFLD signals ─────────────────────────────────────────────────────────
  const hasNAFLD =
    knownConditions.includes("dx_nafld") || goal === "liver_health";

  // ── Metabolic syndrome signals ────────────────────────────────────────────
  const hasMetSyn =
    knownConditions.includes("dx_metabolic_syndrome") ||
    countOf([...symptoms], [
      "high_blood_pressure", "high_triglycerides", "high_blood_sugar",
      "dark_skin_patches", "abdominal_weight",
    ]) >= 2 ||
    goal === "belly_fat";

  // ── Prediabetes signals ───────────────────────────────────────────────────
  const hasPrediabetes =
    knownConditions.includes("dx_prediabetes") ||
    knownConditions.includes("dx_t2d") ||
    symptoms.includes("high_blood_sugar") ||
    goal === "diabetes_risk" ||
    goal === "blood_sugar";

  // ── Weight-loss friction signals ──────────────────────────────────────────
  const frictionCount = countOf([...symptoms], [
    "weight_resistant", "frequent_hunger", "cravings_sugary",
    "energy_crashes", "abdominal_weight", "post_meal_fatigue",
  ]);
  const hasFriction = goal === "weight_management" || frictionCount >= 3;

  // ── General IR signals (catch-all) ────────────────────────────────────────
  const hasIRSignal =
    hasAnyOf([...symptoms], ["energy_crashes", "cravings_sugary", "post_meal_fatigue", "frequent_hunger"]) ||
    knownConditions.includes("dx_ir") ||
    goal === "blood_sugar";

  // ── Profile assignment (priority order from Sprint 4 architecture) ─────────
  let baseProfile: MetabolicProfileV2;

  if (hasPCOS && !hasNAFLD) {
    baseProfile = "pcos";
  } else if (hasNAFLD) {
    baseProfile = "nafld";
  } else if (hasMetSyn) {
    baseProfile = "metabolic_syndrome";
  } else if (hasPrediabetes) {
    baseProfile = "prediabetes";
  } else if (hasFriction) {
    baseProfile = "weight_loss_friction";
  } else if (hasIRSignal) {
    baseProfile = "insulin_resistance";
  } else {
    baseProfile = "general_wellness";
  }

  // ── Get profile content via PROFILE_CONTENT lookup ────────────────────────
  // Direct import — no require(), no synthetic answer bridging.
  const baseContent: ProfileContentBase =
    PROFILE_CONTENT[baseProfile] ?? INSULIN_RESISTANCE_RESULT;

  // ── Compute confidence ────────────────────────────────────────────────────
  let confidence = computeConfidence(answers, baseProfile);

  // PCOS with prefer_not_to_say sex (no confirmed dx): cap at moderate
  if (
    baseProfile === "pcos" &&
    biologicalSex === "prefer_not_to_say" &&
    !pcosFromConditions
  ) {
    confidence = confidence === "high" ? "moderate" : confidence;
  }

  // ── Personalisation note ──────────────────────────────────────────────────
  const note = buildPersonalizationNote(answers);

  // ── Build result ──────────────────────────────────────────────────────────
  return {
    ...baseContent,
    profile: baseProfile,
    profileConfidence: confidence,
    quizVersion: "v2",
    personalizationNote: note,
    planHref: `/pricing?recommended=core&profile=${baseProfile}`,
  } as MatchResultV2;
}

// ── Safety notice (v2 extended) ───────────────────────────────────────────────
// Covers v2 safety flags (heart_disease, thyroid_condition, active_cancer_treatment)
// not handled by v1 getSafetyNotice.

export function getSafetyNoticeV2(answers: QuizAnswersV2): string | null {
  const flags = answers.safetyFlags;
  if (!flags || flags.length === 0 || flags.every((f) => f === "none")) return null;

  if (flags.includes("type1_diabetes") || flags.includes("takes_insulin")) {
    return "You indicated you have type 1 diabetes or take insulin. Dietary changes — especially reducing carbohydrates — can significantly affect your insulin requirements and hypoglycaemia risk. Please discuss any meal plan with your diabetes care team before making changes. The educational content on this platform is not a substitute for individualised medical nutrition therapy.";
  }
  if (flags.includes("hypoglycemia_risk_medication")) {
    return "You indicated you take medication that can cause low blood sugar. Some dietary changes can increase hypoglycaemia risk with certain medications (e.g. sulfonylureas). Please speak with your prescribing doctor before significantly changing your diet.";
  }
  if (flags.includes("pregnant") || flags.includes("breastfeeding")) {
    return "You indicated you are pregnant or breastfeeding. Nutritional requirements during pregnancy and breastfeeding are specific and different from general metabolic health guidance. Please consult a registered dietitian or your midwife before making dietary changes.";
  }
  if (flags.includes("active_cancer_treatment")) {
    return "You indicated you are currently undergoing cancer treatment. Nutritional needs during cancer treatment are highly individual and require specialist oversight. Please discuss any dietary changes with your oncology team or a specialist oncology dietitian.";
  }
  if (flags.includes("advanced_liver_disease")) {
    return "You indicated you have advanced liver disease. Advanced liver disease has specific protein and sodium requirements that differ significantly from general nutrition guidance. Please work with a hepatologist or specialist dietitian before making dietary changes.";
  }
  if (flags.includes("kidney_disease")) {
    return "You indicated you have kidney disease. Kidney disease involves specific restrictions on protein, potassium, and phosphorus. Please consult a renal dietitian before making significant dietary changes.";
  }
  if (flags.includes("heart_disease")) {
    return "You indicated you have heart disease. Significant dietary changes may interact with cardiovascular medications and management. Please speak with your cardiologist or GP before starting any new dietary approach.";
  }
  if (flags.includes("eating_disorder_history")) {
    return "You indicated a history of eating disorders. Some approaches commonly used in metabolic health — calorie tracking, meal restriction — can be triggering or harmful for people with a history of disordered eating. Please work with a healthcare provider experienced in both eating disorders and nutrition before applying any structured meal plan.";
  }
  if (flags.includes("under_18")) {
    return "You indicated you are under 18. The content on this platform is designed for adults. Please speak with a parent or guardian and a paediatric healthcare provider before making dietary changes.";
  }
  if (flags.includes("thyroid_condition")) {
    return "You indicated you have a thyroid condition. Thyroid conditions can affect metabolic rate and energy levels. Some dietary choices may interact with thyroid medication. Please discuss any significant dietary changes with your endocrinologist or GP.";
  }
  return "Some of your answers suggest it's worth speaking with a doctor or qualified healthcare provider before starting any meal plan — including ours. Your educational profile below is safe to read; we simply recommend professional guidance before making significant dietary changes.";
}

// Re-export profile constants for any external consumers that might reference them via v2
export {
  PCOS_RESULT, NAFLD_RESULT, METABOLIC_SYNDROME_RESULT,
  PREDIABETES_RESULT, INSULIN_RESISTANCE_RESULT,
  WEIGHT_LOSS_FRICTION_RESULT, GENERAL_WELLNESS_RESULT,
  PROFILE_CONTENT,
};
