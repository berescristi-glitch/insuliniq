"use client";

// Quiz v2 Stepper — 12-step Quick Quiz.
// Shadow route: /quiz-v2 only. Does NOT modify QuizStepper.tsx.
// Steps: Consent → Goal → Region → Age+Sex → Safety → Known Conditions →
//        Symptoms → Diet → Allergens → Cooking → Budget → Email+Consent

import { useReducer, useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ArrowLeft, ArrowRight, ChevronRight, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { submitQuizV2 } from "@/actions/quiz-v2";
import type {
  QuizAnswersV2, QuizV2Step, QuizGoalV2, BiologicalSex,
  KnownCondition, SafetyFlagV2, SymptomV2, WeeklyBudget,
  Region, DietPattern, Allergen, CookingTime, CookingSkill, AgeRange,
} from "@/lib/quiz/types-v2";

// ── Reducer ───────────────────────────────────────────────────────────────────

type QuizV2Action =
  | { type: "SET_CONSENT"; payload: boolean }
  | { type: "SET_GOAL"; payload: QuizGoalV2 }
  | { type: "SET_COUNTRY"; payload: "US" | "UK" | "AU" | "Other" }
  | { type: "SET_SUBREGION"; payload: string }
  | { type: "SET_AGE"; payload: AgeRange }
  | { type: "SET_SEX"; payload: BiologicalSex }
  | { type: "TOGGLE_SAFETY"; payload: SafetyFlagV2 }
  | { type: "TOGGLE_CONDITION"; payload: KnownCondition }
  | { type: "TOGGLE_SYMPTOM"; payload: SymptomV2 }
  | { type: "SET_DIET"; payload: DietPattern }
  | { type: "TOGGLE_ALLERGEN"; payload: Allergen | "none_allergens" }
  | { type: "SET_COOKING_TIME"; payload: CookingTime }
  | { type: "SET_COOKING_SKILL"; payload: CookingSkill }
  | { type: "SET_BUDGET"; payload: WeeklyBudget }
  | { type: "NEXT_STEP" }
  | { type: "PREV_STEP" };

interface QuizV2State {
  step: QuizV2Step;
  answers: QuizAnswersV2;
  allergenNone: boolean;
}

const INITIAL_ANSWERS: QuizAnswersV2 = {
  healthDataConsent: false,
  goal: null,
  region: null,
  ageRange: null,
  biologicalSex: null,
  safetyFlags: [],
  knownConditions: [],
  symptoms: [],
  dietPattern: null,
  allergens: [],
  cookingTime: null,
  cookingSkill: null,
  weeklyBudget: null,
  email: null,
  marketingConsent: false,
};

function reducer(state: QuizV2State, action: QuizV2Action): QuizV2State {
  const { answers } = state;

  switch (action.type) {
    case "SET_CONSENT":
      return { ...state, answers: { ...answers, healthDataConsent: action.payload } };

    case "SET_GOAL":
      return { ...state, answers: { ...answers, goal: action.payload } };

    case "SET_COUNTRY": {
      const country = action.payload;
      const newRegion: Region =
        country === "US" ? { country: "US", subregion: "Northeast" } :
        country === "UK" ? { country: "UK", subregion: "England South" } :
        country === "AU" ? { country: "AU", subregion: "NSW" } :
        { country: "Other" };
      return { ...state, answers: { ...answers, region: newRegion, weeklyBudget: null } };
    }

    case "SET_SUBREGION": {
      if (!answers.region || answers.region.country === "Other") return state;
      const updated: Region =
        answers.region.country === "US"
          ? { country: "US", subregion: action.payload as import("@/lib/quiz/types").USRegion }
          : answers.region.country === "UK"
          ? { country: "UK", subregion: action.payload as import("@/lib/quiz/types").UKRegion }
          : { country: "AU", subregion: action.payload as import("@/lib/quiz/types").AUState };
      return { ...state, answers: { ...answers, region: updated } };
    }

    case "SET_AGE":
      return { ...state, answers: { ...answers, ageRange: action.payload } };

    case "SET_SEX":
      return { ...state, answers: { ...answers, biologicalSex: action.payload } };

    case "TOGGLE_SAFETY": {
      const flag = action.payload;
      if (flag === "none") {
        return { ...state, answers: { ...answers, safetyFlags: ["none"] } };
      }
      const current = answers.safetyFlags.filter((f) => f !== "none");
      const next = current.includes(flag)
        ? current.filter((f) => f !== flag)
        : [...current, flag];
      return { ...state, answers: { ...answers, safetyFlags: next } };
    }

    case "TOGGLE_CONDITION": {
      const cond = action.payload;
      if (cond === "none_of_above" || cond === "not_tested") {
        return { ...state, answers: { ...answers, knownConditions: [cond] } };
      }
      const current = answers.knownConditions.filter(
        (c) => c !== "none_of_above" && c !== "not_tested"
      );
      const next = current.includes(cond)
        ? current.filter((c) => c !== cond)
        : [...current, cond];
      return { ...state, answers: { ...answers, knownConditions: next } };
    }

    case "TOGGLE_SYMPTOM": {
      const sym = action.payload;
      if (sym === "none") {
        return { ...state, answers: { ...answers, symptoms: ["none"] } };
      }
      const current = answers.symptoms.filter((s) => s !== "none");
      const next = current.includes(sym)
        ? current.filter((s) => s !== sym)
        : [...current, sym];
      return { ...state, answers: { ...answers, symptoms: next } };
    }

    case "SET_DIET":
      return { ...state, answers: { ...answers, dietPattern: action.payload } };

    case "TOGGLE_ALLERGEN": {
      if (action.payload === "none_allergens") {
        return { ...state, allergenNone: true, answers: { ...answers, allergens: [] } };
      }
      const allergen = action.payload as Allergen;
      const current = answers.allergens;
      const next = current.includes(allergen)
        ? current.filter((a) => a !== allergen)
        : [...current, allergen];
      return { ...state, allergenNone: false, answers: { ...answers, allergens: next } };
    }

    case "SET_COOKING_TIME":
      return { ...state, answers: { ...answers, cookingTime: action.payload } };

    case "SET_COOKING_SKILL":
      return { ...state, answers: { ...answers, cookingSkill: action.payload } };

    case "SET_BUDGET":
      return { ...state, answers: { ...answers, weeklyBudget: action.payload } };

    case "NEXT_STEP":
      return { ...state, step: Math.min(12, state.step + 1) as QuizV2Step };

    case "PREV_STEP":
      return { ...state, step: Math.max(1, state.step - 1) as QuizV2Step };

    default:
      return state;
  }
}

// ── Step validation ───────────────────────────────────────────────────────────

function canAdvance(state: QuizV2State): boolean {
  const { step, answers } = state;
  switch (step) {
    case 1:  return answers.healthDataConsent === true;
    case 2:  return answers.goal !== null;
    case 3:  return answers.region !== null;
    case 4:  return answers.ageRange !== null; // sex is optional (defaults to prefer_not_to_say)
    case 5:  return true; // safety: can answer "none" or skip
    case 6:  return true; // known conditions: can answer "none_of_above" or skip
    case 7:  return answers.symptoms.length > 0;
    case 8:  return answers.dietPattern !== null;
    case 9:  return true; // allergens always advanceable
    case 10: return answers.cookingTime !== null && answers.cookingSkill !== null;
    case 11: return true; // budget always advanceable (prefer_not_to_say valid)
    case 12: return true; // email step has its own submit
    default: return false;
  }
}

// ── Step headings ─────────────────────────────────────────────────────────────

const STEP_CONFIG: Record<QuizV2Step, { heading: string; subheading?: string }> = {
  1:  { heading: "Welcome to InsulinIQ", subheading: "A quick note before we start." },
  2:  { heading: "What's your main health focus?", subheading: "Choose the one that matters most right now." },
  3:  { heading: "Where are you based?", subheading: "We adapt all food examples and stores to your location." },
  4:  { heading: "A little about you", subheading: "Optional fields can always be skipped." },
  5:  { heading: "A few health questions", subheading: "These help us personalise the safety notices on your results. Select all that apply." },
  6:  { heading: "Any diagnosed conditions?", subheading: "Select what a healthcare professional has told you. 'I haven't been tested' is a valid answer." },
  7:  { heading: "What have you noticed recently?", subheading: "Select all that apply. These help personalise your educational profile — they are not a diagnosis." },
  8:  { heading: "How would you describe your current diet?", subheading: "No judgement — this helps us meet you where you are." },
  9:  { heading: "Any allergies or dietary needs?", subheading: "We filter every recipe and food example for these." },
  10: { heading: "Your cooking reality", subheading: "Realistic meals for your actual schedule." },
  11: { heading: "Weekly food budget", subheading: "Helps us suggest affordable options. Always optional." },
  12: { heading: "Your profile is ready", subheading: undefined },
};

// ── Shared step props ─────────────────────────────────────────────────────────

interface StepProps {
  state: QuizV2State;
  dispatch: React.Dispatch<QuizV2Action>;
}

// ── Step 1: Health data consent ────────────────────────────────────────────────

function Step1Consent({ state, dispatch }: StepProps) {
  return (
    <div className="space-y-5">
      <div className="rounded-xl border border-border bg-forest-50/50 p-5 space-y-3">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-forest-600 flex-shrink-0" />
          <p className="text-sm font-semibold text-foreground">How we use your answers</p>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">
          This quiz will ask some health-related questions — including symptoms, conditions you've been told
          you have, and dietary context. Your answers are used <strong>only</strong> to personalise your
          free educational profile. We never sell your data.
        </p>
        <ul className="text-sm text-muted-foreground space-y-1 pl-4 list-disc">
          <li>Every health question is optional — "prefer not to say" is always available.</li>
          <li>No answers constitute a diagnosis or medical assessment.</li>
          <li>Results are educational only. Not medical advice.</li>
        </ul>
      </div>

      <label className="flex items-start gap-3 cursor-pointer rounded-xl border-2 p-4 transition-colors hover:border-forest-300 hover:bg-forest-50/30"
        style={{ borderColor: state.answers.healthDataConsent ? "#059669" : undefined }}>
        <input
          type="checkbox"
          checked={state.answers.healthDataConsent}
          onChange={(e) => dispatch({ type: "SET_CONSENT", payload: e.target.checked })}
          className="mt-0.5 h-4 w-4 flex-shrink-0 accent-forest-600 cursor-pointer"
        />
        <span className="text-sm text-foreground leading-snug">
          I understand that my quiz answers will be used to personalise my free educational metabolic
          profile. This quiz is educational only and does not provide medical advice or a diagnosis.
        </span>
      </label>

      <p className="text-xs text-muted-foreground/70 text-center">
        By proceeding you also confirm you are 18 or older, or have parental consent.{" "}
        <a href="/legal/privacy" target="_blank" rel="noopener noreferrer" className="underline hover:text-muted-foreground">
          Privacy Policy
        </a>
      </p>
    </div>
  );
}

// ── Step 2: Goal ──────────────────────────────────────────────────────────────

const GOAL_OPTIONS: { value: QuizGoalV2; emoji: string; label: string }[] = [
  { value: "blood_sugar",       emoji: "🩸", label: "Understand my blood sugar patterns" },
  { value: "belly_fat",         emoji: "🎯", label: "Reduce abdominal or belly fat" },
  { value: "pcos",              emoji: "🌸", label: "Support my PCOS metabolic health" },
  { value: "liver_health",      emoji: "🫀", label: "Learn about metabolic liver health (NAFLD/MASLD)" },
  { value: "diabetes_risk",     emoji: "📊", label: "Understand my type 2 diabetes educational risk" },
  { value: "weight_management", emoji: "⚖️", label: "Understand why weight loss feels difficult" },
  { value: "just_learning",     emoji: "🥗", label: "Understand my metabolic health better" },
];

function Step2Goal({ state, dispatch }: StepProps) {
  return (
    <div className="grid grid-cols-1 gap-2.5">
      {GOAL_OPTIONS.map((o) => (
        <button
          key={o.value}
          type="button"
          onClick={() => dispatch({ type: "SET_GOAL", payload: o.value })}
          className={cn(
            "flex items-center gap-3 rounded-xl border-2 px-4 py-3 text-left text-sm font-medium transition-all",
            state.answers.goal === o.value
              ? "border-forest-500 bg-forest-50 text-forest-800"
              : "border-border hover:border-forest-300 hover:bg-forest-50/30 text-foreground"
          )}
        >
          <span className="text-xl leading-none flex-shrink-0">{o.emoji}</span>
          <span>{o.label}</span>
        </button>
      ))}
    </div>
  );
}

// ── Step 3: Region ────────────────────────────────────────────────────────────

const US_REGIONS = ["Northeast", "Midwest", "South", "Southwest", "West Coast", "Pacific Northwest"];
const UK_REGIONS = ["England North", "England South", "Scotland", "Wales", "Northern Ireland"];
const AU_STATES  = ["NSW", "VIC", "QLD", "WA", "SA", "TAS", "ACT", "NT"];

function Step3Region({ state, dispatch }: StepProps) {
  const country = state.answers.region?.country ?? null;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-2.5">
        {(["US", "UK", "AU", "Other"] as const).map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => dispatch({ type: "SET_COUNTRY", payload: c })}
            className={cn(
              "flex items-center gap-2 rounded-xl border-2 px-4 py-3 text-sm font-semibold transition-all",
              country === c
                ? "border-forest-500 bg-forest-50 text-forest-800"
                : "border-border hover:border-forest-300 text-foreground"
            )}
          >
            <span>{c === "US" ? "🇺🇸" : c === "UK" ? "🇬🇧" : c === "AU" ? "🇦🇺" : "🌍"}</span>
            <span>{c === "Other" ? "Other" : c}</span>
          </button>
        ))}
      </div>

      {/* Conditional subregion */}
      {country && country !== "Other" && (
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground font-medium">
            {country === "US" ? "Which region?" : country === "UK" ? "Which part of the UK?" : "Which state/territory?"}
          </p>
          <div className="grid grid-cols-2 gap-2">
            {(country === "US" ? US_REGIONS : country === "UK" ? UK_REGIONS : AU_STATES).map((r) => {
              const currentSub = state.answers.region && state.answers.region.country !== "Other"
                ? state.answers.region.subregion : "";
              return (
                <button
                  key={r}
                  type="button"
                  onClick={() => dispatch({ type: "SET_SUBREGION", payload: r })}
                  className={cn(
                    "rounded-lg border-2 px-3 py-2 text-xs font-medium transition-all text-left",
                    currentSub === r
                      ? "border-forest-500 bg-forest-50 text-forest-800"
                      : "border-border hover:border-forest-300 text-foreground"
                  )}
                >
                  {r}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Step 4: Age + sex ─────────────────────────────────────────────────────────

const AGE_OPTIONS: { value: AgeRange; label: string }[] = [
  { value: "under_25", label: "Under 25" },
  { value: "25_34",    label: "25–34" },
  { value: "35_44",    label: "35–44" },
  { value: "45_54",    label: "45–54" },
  { value: "55_64",    label: "55–64" },
  { value: "65_plus",  label: "65+" },
];

const SEX_OPTIONS: { value: BiologicalSex; label: string; note?: string }[] = [
  { value: "female",          label: "Female" },
  { value: "male",            label: "Male" },
  { value: "intersex",        label: "Intersex" },
  { value: "prefer_not_to_say", label: "Prefer not to say", note: "Always fine to skip" },
];

function Step4AgeSex({ state, dispatch }: StepProps) {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold text-foreground mb-2">Age range</p>
        <div className="grid grid-cols-3 gap-2">
          {AGE_OPTIONS.map((o) => (
            <button
              key={o.value}
              type="button"
              onClick={() => dispatch({ type: "SET_AGE", payload: o.value })}
              className={cn(
                "rounded-xl border-2 py-2.5 text-sm font-medium transition-all",
                state.answers.ageRange === o.value
                  ? "border-forest-500 bg-forest-50 text-forest-800"
                  : "border-border hover:border-forest-300 text-foreground"
              )}
            >
              {o.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-sm font-semibold text-foreground mb-1">Biological sex</p>
        <p className="text-xs text-muted-foreground mb-2">
          This helps personalise content about hormones and metabolic patterns. Always optional.
        </p>
        <div className="grid grid-cols-2 gap-2">
          {SEX_OPTIONS.map((o) => (
            <button
              key={o.value}
              type="button"
              onClick={() => dispatch({ type: "SET_SEX", payload: o.value })}
              className={cn(
                "rounded-xl border-2 px-3 py-2.5 text-sm font-medium transition-all text-left",
                state.answers.biologicalSex === o.value
                  ? "border-forest-500 bg-forest-50 text-forest-800"
                  : "border-border hover:border-forest-300 text-foreground"
              )}
            >
              {o.label}
              {o.note && <span className="block text-xs text-muted-foreground font-normal">{o.note}</span>}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Step 5: Safety flags ──────────────────────────────────────────────────────

const SAFETY_OPTIONS: { value: SafetyFlagV2; label: string }[] = [
  { value: "type1_diabetes",             label: "I have type 1 diabetes" },
  { value: "takes_insulin",              label: "I take insulin (any type)" },
  { value: "hypoglycemia_risk_medication", label: "I take medication that can cause low blood sugar" },
  { value: "pregnant",                   label: "I am currently pregnant" },
  { value: "breastfeeding",              label: "I am currently breastfeeding" },
  { value: "kidney_disease",             label: "I have kidney disease or am on dialysis" },
  { value: "advanced_liver_disease",     label: "I have advanced liver disease or cirrhosis" },
  { value: "heart_disease",              label: "I have heart disease or have had a heart attack/stroke" },
  { value: "thyroid_condition",          label: "I have a thyroid condition (hypo/hyperthyroid)" },
  { value: "eating_disorder_history",    label: "I have a history of eating disorders" },
  { value: "active_cancer_treatment",    label: "I am currently undergoing cancer treatment" },
  { value: "under_18",                   label: "I am under 18 years old" },
];

function Step5Safety({ state, dispatch }: StepProps) {
  const flags = state.answers.safetyFlags;
  const hasNone = flags.includes("none");

  return (
    <div className="space-y-3">
      <p className="text-xs text-muted-foreground">
        These help us show appropriate safety notices on your results. They are not used to restrict access
        to educational content.
      </p>
      <div className="space-y-2">
        {SAFETY_OPTIONS.map((o) => (
          <button
            key={o.value}
            type="button"
            onClick={() => dispatch({ type: "TOGGLE_SAFETY", payload: o.value })}
            className={cn(
              "w-full flex items-center gap-3 rounded-xl border-2 px-4 py-2.5 text-left text-sm font-medium transition-all",
              flags.includes(o.value)
                ? "border-clay-400 bg-clay-50 text-clay-800"
                : "border-border hover:border-clay-300 text-foreground"
            )}
          >
            <span className={cn("flex h-4 w-4 flex-shrink-0 items-center justify-center rounded border-2 transition-colors",
              flags.includes(o.value) ? "border-clay-500 bg-clay-500" : "border-border"
            )}>
              {flags.includes(o.value) && <Check className="h-2.5 w-2.5 text-white" />}
            </span>
            {o.label}
          </button>
        ))}
        <button
          type="button"
          onClick={() => dispatch({ type: "TOGGLE_SAFETY", payload: "none" })}
          className={cn(
            "w-full flex items-center gap-3 rounded-xl border-2 px-4 py-2.5 text-left text-sm font-medium transition-all",
            hasNone
              ? "border-forest-500 bg-forest-50 text-forest-800"
              : "border-border hover:border-forest-300 text-foreground"
          )}
        >
          <span className={cn("flex h-4 w-4 flex-shrink-0 items-center justify-center rounded border-2 transition-colors",
            hasNone ? "border-forest-500 bg-forest-500" : "border-border"
          )}>
            {hasNone && <Check className="h-2.5 w-2.5 text-white" />}
          </span>
          None of these apply to me
        </button>
      </div>
    </div>
  );
}

// ── Step 6: Known conditions ──────────────────────────────────────────────────

const CONDITION_OPTIONS: { value: KnownCondition; label: string }[] = [
  { value: "dx_ir",                label: "Insulin resistance" },
  { value: "dx_prediabetes",       label: "Prediabetes or impaired fasting glucose" },
  { value: "dx_t2d",               label: "Type 2 diabetes" },
  { value: "dx_pcos",              label: "Polycystic ovary syndrome (PCOS)" },
  { value: "dx_nafld",             label: "Fatty liver disease / NAFLD / MASLD" },
  { value: "dx_metabolic_syndrome",label: "Metabolic syndrome" },
  { value: "dx_hypothyroid",       label: "Underactive thyroid (hypothyroidism)" },
  { value: "dx_hypertension",      label: "High blood pressure (hypertension)" },
  { value: "dx_dyslipidemia",      label: "High cholesterol or high triglycerides" },
  { value: "dx_sleep_apnea",       label: "Sleep apnoea" },
];

function Step6KnownConditions({ state, dispatch }: StepProps) {
  const conditions = state.answers.knownConditions;
  const isNone = conditions.includes("none_of_above");
  const isUnknown = conditions.includes("not_tested");

  return (
    <div className="space-y-2">
      {CONDITION_OPTIONS.map((o) => (
        <button
          key={o.value}
          type="button"
          onClick={() => dispatch({ type: "TOGGLE_CONDITION", payload: o.value })}
          className={cn(
            "w-full flex items-center gap-3 rounded-xl border-2 px-4 py-2.5 text-left text-sm font-medium transition-all",
            conditions.includes(o.value)
              ? "border-forest-500 bg-forest-50 text-forest-800"
              : "border-border hover:border-forest-300 text-foreground"
          )}
        >
          <span className={cn("flex h-4 w-4 flex-shrink-0 items-center justify-center rounded border-2",
            conditions.includes(o.value) ? "border-forest-500 bg-forest-500" : "border-border"
          )}>
            {conditions.includes(o.value) && <Check className="h-2.5 w-2.5 text-white" />}
          </span>
          {o.label}
        </button>
      ))}
      {(["none_of_above", "not_tested"] as const).map((v) => (
        <button
          key={v}
          type="button"
          onClick={() => dispatch({ type: "TOGGLE_CONDITION", payload: v })}
          className={cn(
            "w-full flex items-center gap-3 rounded-xl border-2 px-4 py-2.5 text-left text-sm font-medium transition-all",
            (v === "none_of_above" ? isNone : isUnknown)
              ? "border-forest-500 bg-forest-50 text-forest-800"
              : "border-border hover:border-forest-300 text-foreground"
          )}
        >
          <span className={cn("flex h-4 w-4 flex-shrink-0 items-center justify-center rounded border-2",
            (v === "none_of_above" ? isNone : isUnknown) ? "border-forest-500 bg-forest-500" : "border-border"
          )}>
            {(v === "none_of_above" ? isNone : isUnknown) && <Check className="h-2.5 w-2.5 text-white" />}
          </span>
          {v === "none_of_above" ? "None of these have been diagnosed" : "I haven't had relevant testing / I don't know"}
        </button>
      ))}
    </div>
  );
}

// ── Step 7: Symptoms ──────────────────────────────────────────────────────────

const SYMPTOM_OPTIONS: { value: SymptomV2; label: string }[] = [
  { value: "energy_crashes",      label: "Energy crashes in the afternoon or after meals" },
  { value: "cravings_sugary",     label: "Strong cravings for sweet or starchy foods" },
  { value: "weight_resistant",    label: "Difficulty losing weight even when trying" },
  { value: "post_meal_fatigue",   label: "Feeling very tired or foggy after eating" },
  { value: "frequent_hunger",     label: "Feeling hungry again within 2 hours of eating" },
  { value: "abdominal_weight",    label: "Most of my extra weight is around my belly" },
  { value: "high_blood_sugar",    label: "Been told my blood sugar is higher than normal" },
  { value: "high_blood_pressure", label: "Been told my blood pressure is higher than normal" },
  { value: "high_triglycerides",  label: "Been told my triglycerides are higher than normal" },
  { value: "irregular_periods",   label: "Irregular, infrequent, or missed periods" },
  { value: "acne_or_hair_growth", label: "Acne or unwanted hair growth (face/body)" },
  { value: "dark_skin_patches",   label: "Darker patches of skin (neck, armpits, or groin)" },
  { value: "skin_tags",           label: "Small skin tags on neck, armpits, or groin" },
  { value: "sleep_issues",        label: "Poor sleep quality or difficulty staying asleep" },
  { value: "family_history",      label: "Close family member with diabetes, PCOS, or heart disease" },
];

function Step7Symptoms({ state, dispatch }: StepProps) {
  const symptoms = state.answers.symptoms;
  const isNone = symptoms.includes("none");

  return (
    <div className="space-y-2">
      {SYMPTOM_OPTIONS.map((o) => (
        <button
          key={o.value}
          type="button"
          onClick={() => dispatch({ type: "TOGGLE_SYMPTOM", payload: o.value })}
          className={cn(
            "w-full flex items-center gap-3 rounded-xl border-2 px-4 py-2.5 text-left text-sm font-medium transition-all",
            symptoms.includes(o.value)
              ? "border-sage-500 bg-sage-50 text-sage-800"
              : "border-border hover:border-sage-300 text-foreground"
          )}
        >
          <span className={cn("flex h-4 w-4 flex-shrink-0 items-center justify-center rounded border-2",
            symptoms.includes(o.value) ? "border-sage-500 bg-sage-500" : "border-border"
          )}>
            {symptoms.includes(o.value) && <Check className="h-2.5 w-2.5 text-white" />}
          </span>
          {o.label}
        </button>
      ))}
      <button
        type="button"
        onClick={() => dispatch({ type: "TOGGLE_SYMPTOM", payload: "none" })}
        className={cn(
          "w-full flex items-center gap-3 rounded-xl border-2 px-4 py-2.5 text-left text-sm font-medium transition-all",
          isNone
            ? "border-forest-500 bg-forest-50 text-forest-800"
            : "border-border hover:border-forest-300 text-foreground"
        )}
      >
        <span className={cn("flex h-4 w-4 flex-shrink-0 items-center justify-center rounded border-2",
          isNone ? "border-forest-500 bg-forest-500" : "border-border"
        )}>
          {isNone && <Check className="h-2.5 w-2.5 text-white" />}
        </span>
        None of these currently apply to me
      </button>
    </div>
  );
}

// ── Step 8: Diet pattern ──────────────────────────────────────────────────────

const DIET_OPTIONS: { value: DietPattern; emoji: string; label: string }[] = [
  { value: "no_particular",   emoji: "🍽️", label: "No particular diet / I eat whatever's available" },
  { value: "trying_healthier",emoji: "🥗", label: "I'm trying to eat healthier but finding it hard" },
  { value: "low_carb",        emoji: "🥩", label: "I follow a low-carb or keto approach" },
  { value: "mediterranean",   emoji: "🫒", label: "I eat a Mediterranean-style diet" },
  { value: "vegetarian",      emoji: "🌿", label: "I'm vegetarian" },
  { value: "vegan",           emoji: "🌱", label: "I'm vegan" },
];

function Step8Diet({ state, dispatch }: StepProps) {
  return (
    <div className="space-y-2.5">
      {DIET_OPTIONS.map((o) => (
        <button
          key={o.value}
          type="button"
          onClick={() => dispatch({ type: "SET_DIET", payload: o.value })}
          className={cn(
            "w-full flex items-center gap-3 rounded-xl border-2 px-4 py-3 text-left text-sm font-medium transition-all",
            state.answers.dietPattern === o.value
              ? "border-forest-500 bg-forest-50 text-forest-800"
              : "border-border hover:border-forest-300 text-foreground"
          )}
        >
          <span className="text-lg leading-none flex-shrink-0">{o.emoji}</span>
          {o.label}
        </button>
      ))}
    </div>
  );
}

// ── Step 9: Allergens ─────────────────────────────────────────────────────────

const ALLERGEN_OPTIONS: { value: Allergen; label: string }[] = [
  { value: "gluten",    label: "Gluten-free" },
  { value: "dairy",     label: "Dairy-free" },
  { value: "eggs",      label: "Egg-free" },
  { value: "peanuts",   label: "Peanut-free" },
  { value: "tree_nuts", label: "Tree nut-free" },
  { value: "soy",       label: "Soy-free" },
  { value: "fish",      label: "Fish-free" },
  { value: "shellfish", label: "Shellfish-free" },
  { value: "sesame",    label: "Sesame-free" },
  { value: "halal",     label: "Halal" },
  { value: "kosher",    label: "Kosher" },
];

function Step9Allergens({ state, dispatch }: StepProps) {
  const allergens = state.answers.allergens;
  return (
    <div className="space-y-2">
      <div className="grid grid-cols-2 gap-2">
        {ALLERGEN_OPTIONS.map((o) => (
          <button
            key={o.value}
            type="button"
            onClick={() => dispatch({ type: "TOGGLE_ALLERGEN", payload: o.value })}
            className={cn(
              "flex items-center gap-2 rounded-xl border-2 px-3 py-2.5 text-left text-sm font-medium transition-all",
              allergens.includes(o.value)
                ? "border-forest-500 bg-forest-50 text-forest-800"
                : "border-border hover:border-forest-300 text-foreground"
            )}
          >
            <span className={cn("flex h-4 w-4 flex-shrink-0 items-center justify-center rounded border-2",
              allergens.includes(o.value) ? "border-forest-500 bg-forest-500" : "border-border"
            )}>
              {allergens.includes(o.value) && <Check className="h-2.5 w-2.5 text-white" />}
            </span>
            {o.label}
          </button>
        ))}
      </div>
      <button
        type="button"
        onClick={() => dispatch({ type: "TOGGLE_ALLERGEN", payload: "none_allergens" })}
        className={cn(
          "w-full flex items-center gap-3 rounded-xl border-2 px-4 py-2.5 text-left text-sm font-medium transition-all",
          state.allergenNone
            ? "border-forest-500 bg-forest-50 text-forest-800"
            : "border-border hover:border-forest-300 text-foreground"
        )}
      >
        <span className={cn("flex h-4 w-4 flex-shrink-0 items-center justify-center rounded border-2",
          state.allergenNone ? "border-forest-500 bg-forest-500" : "border-border"
        )}>
          {state.allergenNone && <Check className="h-2.5 w-2.5 text-white" />}
        </span>
        None — no restrictions
      </button>
    </div>
  );
}

// ── Step 10: Cooking ──────────────────────────────────────────────────────────

const COOKING_TIME_OPTIONS: { value: CookingTime; label: string }[] = [
  { value: "under_20", label: "Under 20 minutes" },
  { value: "20_40",    label: "20–40 minutes" },
  { value: "40_60",    label: "40–60 minutes" },
  { value: "60_plus",  label: "Over 60 minutes" },
];

const COOKING_SKILL_OPTIONS: { value: CookingSkill; label: string; sub: string }[] = [
  { value: "beginner",     label: "Complete beginner",      sub: "I mostly use ready meals" },
  { value: "basics",       label: "I can manage the basics", sub: "Simple recipes are fine" },
  { value: "confident",    label: "Confident in the kitchen", sub: "Happy to follow any recipe" },
  { value: "experimental", label: "I enjoy experimenting",    sub: "Advanced recipes welcome" },
];

function Step10Cooking({ state, dispatch }: StepProps) {
  return (
    <div className="space-y-5">
      <div>
        <p className="text-sm font-semibold text-foreground mb-2">
          How much time do you have to cook on a typical weekday?
        </p>
        <div className="grid grid-cols-2 gap-2">
          {COOKING_TIME_OPTIONS.map((o) => (
            <button
              key={o.value}
              type="button"
              onClick={() => dispatch({ type: "SET_COOKING_TIME", payload: o.value })}
              className={cn(
                "rounded-xl border-2 px-3 py-2.5 text-sm font-medium transition-all",
                state.answers.cookingTime === o.value
                  ? "border-forest-500 bg-forest-50 text-forest-800"
                  : "border-border hover:border-forest-300 text-foreground"
              )}
            >
              {o.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-sm font-semibold text-foreground mb-2">Cooking skill level</p>
        <div className="space-y-2">
          {COOKING_SKILL_OPTIONS.map((o) => (
            <button
              key={o.value}
              type="button"
              onClick={() => dispatch({ type: "SET_COOKING_SKILL", payload: o.value })}
              className={cn(
                "w-full rounded-xl border-2 px-4 py-2.5 text-left text-sm font-medium transition-all",
                state.answers.cookingSkill === o.value
                  ? "border-forest-500 bg-forest-50 text-forest-800"
                  : "border-border hover:border-forest-300 text-foreground"
              )}
            >
              {o.label}
              <span className="block text-xs text-muted-foreground font-normal">{o.sub}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Step 11: Budget ───────────────────────────────────────────────────────────

function Step11Budget({ state, dispatch }: StepProps) {
  const country = state.answers.region?.country;
  const current = state.answers.weeklyBudget;

  const options: { tier: string; label: string }[] =
    country === "US"
      ? [
          { tier: "under_60",     label: "Under $60/week" },
          { tier: "60_100",       label: "$60–100/week" },
          { tier: "100_150",      label: "$100–150/week" },
          { tier: "over_150",     label: "Over $150/week" },
          { tier: "prefer_not_to_say", label: "Prefer not to say" },
        ]
      : country === "UK"
      ? [
          { tier: "under_40",     label: "Under £40/week" },
          { tier: "40_70",        label: "£40–70/week" },
          { tier: "70_100",       label: "£70–100/week" },
          { tier: "over_100",     label: "Over £100/week" },
          { tier: "prefer_not_to_say", label: "Prefer not to say" },
        ]
      : country === "AU"
      ? [
          { tier: "under_70",     label: "Under A$70/week" },
          { tier: "70_120",       label: "A$70–120/week" },
          { tier: "120_180",      label: "A$120–180/week" },
          { tier: "over_180",     label: "Over A$180/week" },
          { tier: "prefer_not_to_say", label: "Prefer not to say" },
        ]
      : [
          { tier: "low",           label: "Budget-conscious" },
          { tier: "moderate",      label: "Moderate budget" },
          { tier: "no_constraint", label: "No particular budget constraint" },
          { tier: "prefer_not_to_say", label: "Prefer not to say" },
        ];

  return (
    <div className="space-y-2">
      <p className="text-xs text-muted-foreground">
        Helps us suggest affordable, accessible options. This is always optional.
      </p>
      {options.map((o) => {
        const isSelected = current?.tier === o.tier;
        return (
          <button
            key={o.tier}
            type="button"
            onClick={() => dispatch({
              type: "SET_BUDGET",
              payload: country === "US" ? { country: "US", tier: o.tier as import("@/lib/quiz/types-v2").BudgetTierUS }
                : country === "UK" ? { country: "UK", tier: o.tier as import("@/lib/quiz/types-v2").BudgetTierUK }
                : country === "AU" ? { country: "AU", tier: o.tier as import("@/lib/quiz/types-v2").BudgetTierAU }
                : { country: "Other", tier: o.tier as import("@/lib/quiz/types-v2").BudgetTierOther },
            })}
            className={cn(
              "w-full rounded-xl border-2 px-4 py-2.5 text-left text-sm font-medium transition-all",
              isSelected
                ? "border-forest-500 bg-forest-50 text-forest-800"
                : "border-border hover:border-forest-300 text-foreground"
            )}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

// ── Step 12: Email + consent ──────────────────────────────────────────────────

interface Step12EmailProps extends StepProps {
  sessionId: string;
  onSubmit: (email: string, marketingConsent: boolean) => Promise<void>;
  onSkip: () => void;
  isSubmitting: boolean;
}

function Step12Email({ state, dispatch, onSubmit, onSkip, isSubmitting }: Step12EmailProps) {
  const [localEmail, setLocalEmail] = useState(state.answers.email ?? "");
  const [marketing, setMarketing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const trimmed = localEmail.trim();
    if (!trimmed) { setError("Please enter your email address."); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) { setError("Please enter a valid email address."); return; }
    await onSubmit(trimmed, marketing);
  }

  return (
    <div className="space-y-5">
      <div className="text-center space-y-2">
        <div className="text-4xl">📬</div>
        <p className="text-sm text-muted-foreground">
          Enter your email to save your results and access your educational metabolic profile.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label htmlFor="v2-email" className="text-sm font-medium text-foreground">Email address</label>
          <input
            id="v2-email"
            type="email"
            autoComplete="email"
            value={localEmail}
            onChange={(e) => { setLocalEmail(e.target.value); setError(null); }}
            placeholder="you@example.com"
            className={cn(
              "w-full rounded-xl border-2 bg-white px-4 py-3 text-sm text-foreground",
              "focus:outline-none focus:ring-2 focus:ring-forest-300 focus:border-forest-400",
              "placeholder:text-muted-foreground/50",
              error ? "border-red-400" : "border-border"
            )}
          />
          {error && <p className="text-xs text-red-500">{error}</p>}
        </div>

        {/* Marketing consent — unchecked by default (GDPR/PECR/AU Spam Act) */}
        <div className="rounded-xl border border-border bg-muted/30 p-4">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={marketing}
              onChange={(e) => setMarketing(e.target.checked)}
              className="mt-0.5 h-4 w-4 flex-shrink-0 rounded accent-forest-600 cursor-pointer"
            />
            <span className="text-sm text-foreground leading-snug">
              I&apos;d like to receive educational emails from InsulinIQ about metabolic health,
              nutrition habits, and future product updates. I can unsubscribe at any time.
            </span>
          </label>
          <p className="mt-2 text-xs text-muted-foreground/70 pl-7">
            Your quiz result is shown regardless of this choice. Marketing emails are optional.
          </p>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={cn(
            "w-full rounded-xl px-6 py-3 text-sm font-semibold text-white transition-colors",
            "bg-forest-600 hover:bg-forest-700 focus:outline-none focus:ring-2 focus:ring-forest-300 focus:ring-offset-2",
            "disabled:opacity-60 disabled:cursor-not-allowed"
          )}
        >
          {isSubmitting ? "Preparing your profile…" : "Show My Results"}
        </button>
      </form>

      <div className="text-center space-y-2">
        <button
          type="button"
          onClick={onSkip}
          disabled={isSubmitting}
          className="text-sm text-muted-foreground underline underline-offset-2 hover:text-foreground transition-colors disabled:opacity-50"
        >
          Skip — show me my results without saving
        </button>
        <p className="text-xs text-muted-foreground/70">
          We do not sell your data. See our{" "}
          <a href="/legal/privacy" target="_blank" rel="noopener noreferrer" className="underline">
            Privacy Policy
          </a>
          .
        </p>
      </div>
    </div>
  );
}

// ── Animation variants ────────────────────────────────────────────────────────

const variants = {
  enter: (d: number) => ({ x: d > 0 ? 60 : -60, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (d: number) => ({ x: d > 0 ? -60 : 60, opacity: 0 }),
};

// ── Main component ────────────────────────────────────────────────────────────

export function QuizStepperV2() {
  const router = useRouter();
  const [state, dispatch] = useReducer(reducer, {
    step: 1,
    answers: INITIAL_ANSWERS,
    allergenNone: false,
  });
  const [sessionId, setSessionId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const prevStepRef = useRef<QuizV2Step>(1);

  useEffect(() => { setSessionId(crypto.randomUUID()); }, []);

  const { step, answers } = state;
  const config = STEP_CONFIG[step];
  const progress = ((step - 1) / 11) * 100;
  const direction = step >= prevStepRef.current ? 1 : -1;

  function handleNext() {
    if (!canAdvance(state)) return;
    prevStepRef.current = step;
    dispatch({ type: "NEXT_STEP" });
  }

  function handleBack() {
    prevStepRef.current = step;
    dispatch({ type: "PREV_STEP" });
  }

  async function handleEmailSubmit(email: string, marketingConsent: boolean) {
    setIsSubmitting(true);
    try {
      const result = await submitQuizV2({ sessionId, answers: { ...answers, email, marketingConsent }, email, marketingConsent });
      if (result.success) {
        router.push(`/quiz-v2/results?session=${result.profileId}`);
      } else {
        handleSkip();
      }
    } catch {
      handleSkip();
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleSkip() {
    try {
      sessionStorage.setItem(`quiz_v2_answers_${sessionId}`, JSON.stringify(answers));
    } catch { /* ignore storage errors */ }
    router.push(`/quiz-v2/results?session=${sessionId}&skip=1`);
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-3xl shadow-xl border border-forest-100 overflow-hidden">
        {/* Accent bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-forest-400 via-sage-400 to-honey-400" />

        {/* Progress */}
        <div className="h-1 w-full bg-forest-100">
          <motion.div
            className="h-full bg-forest-500"
            initial={false}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
          />
        </div>

        {/* Step counter */}
        <div className="px-6 pt-5 pb-2 flex items-center justify-between">
          <span className="text-xs text-muted-foreground font-medium">
            Question {step} of 12
          </span>
          <span className="text-xs text-muted-foreground">
            {Math.round(progress)}% complete
          </span>
        </div>

        {/* Step content */}
        <div className="px-6 pb-6 min-h-[340px]">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={step}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.22, ease: "easeInOut" }}
            >
              <h2 className="text-xl font-bold text-foreground mb-1">{config.heading}</h2>
              {config.subheading && (
                <p className="text-sm text-muted-foreground mb-4">{config.subheading}</p>
              )}

              {step === 1  && <Step1Consent state={state} dispatch={dispatch} />}
              {step === 2  && <Step2Goal state={state} dispatch={dispatch} />}
              {step === 3  && <Step3Region state={state} dispatch={dispatch} />}
              {step === 4  && <Step4AgeSex state={state} dispatch={dispatch} />}
              {step === 5  && <Step5Safety state={state} dispatch={dispatch} />}
              {step === 6  && <Step6KnownConditions state={state} dispatch={dispatch} />}
              {step === 7  && <Step7Symptoms state={state} dispatch={dispatch} />}
              {step === 8  && <Step8Diet state={state} dispatch={dispatch} />}
              {step === 9  && <Step9Allergens state={state} dispatch={dispatch} />}
              {step === 10 && <Step10Cooking state={state} dispatch={dispatch} />}
              {step === 11 && <Step11Budget state={state} dispatch={dispatch} />}
              {step === 12 && (
                <Step12Email
                  state={state}
                  dispatch={dispatch}
                  sessionId={sessionId}
                  onSubmit={handleEmailSubmit}
                  onSkip={handleSkip}
                  isSubmitting={isSubmitting}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation footer — hidden on step 12 (has its own submit) */}
        {step !== 12 && (
          <div className="border-t border-border px-6 py-4 flex items-center justify-between">
            {step > 1 ? (
              <button
                type="button"
                onClick={handleBack}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </button>
            ) : <div />}

            <button
              type="button"
              onClick={handleNext}
              disabled={!canAdvance(state)}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition-all",
                "focus:outline-none focus:ring-2 focus:ring-forest-300 focus:ring-offset-2",
                canAdvance(state)
                  ? "bg-forest-600 hover:bg-forest-700 shadow-sm shadow-forest-600/20"
                  : "bg-muted-foreground/30 cursor-not-allowed"
              )}
            >
              {step === 11 ? "Almost done" : "Continue"}
              {step < 11
                ? <ChevronRight className="h-4 w-4" />
                : <ArrowRight className="h-4 w-4" />}
            </button>
          </div>
        )}
      </div>

      <p className="mt-4 text-center text-xs text-muted-foreground/70">
        Your answers are private. We never share or sell personal information.
      </p>
    </div>
  );
}
