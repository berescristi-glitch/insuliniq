"use client";

// Multi-step metabolic quiz. State lives entirely in useReducer — no external store.
// framer-motion AnimatePresence handles slide transitions between steps.
// The server action (submitQuiz) is called only at the email gate step.

import { useReducer, useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ArrowLeft, ArrowRight, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { submitQuiz } from "@/actions/quiz";
import type {
  QuizAnswers,
  QuizStep,
  QuizGoal,
  Region,
  USRegion,
  UKRegion,
  AUState,
  Symptom,
  DietPattern,
  Allergen,
  CookingTime,
  CookingSkill,
  AgeRange,
} from "@/lib/quiz/types";

// ---------------------------------------------------------------------------
// Reducer
// ---------------------------------------------------------------------------

type QuizAction =
  | { type: "SET_GOAL"; payload: QuizGoal }
  | { type: "SET_REGION"; payload: Region }
  | { type: "TOGGLE_SYMPTOM"; payload: Symptom }
  | { type: "SET_DIET"; payload: DietPattern }
  | { type: "TOGGLE_ALLERGEN"; payload: Allergen | "none" }
  | { type: "SET_COOKING_TIME"; payload: CookingTime }
  | { type: "SET_COOKING_SKILL"; payload: CookingSkill }
  | { type: "SET_AGE"; payload: AgeRange }
  | { type: "SET_STEP"; payload: QuizStep }
  | { type: "NEXT_STEP" }
  | { type: "PREV_STEP" };

interface QuizState {
  step: QuizStep;
  direction: 1 | -1; // 1 = forward, -1 = backward (for animation)
  answers: QuizAnswers;
  allergenNone: boolean; // tracks the "None" selection separately
}

const initialAnswers: QuizAnswers = {
  goal: null,
  region: null,
  symptoms: [],
  dietPattern: null,
  allergens: [],
  cookingTime: null,
  cookingSkill: null,
  ageRange: null,
  email: null,
};

const initialState: QuizState = {
  step: 1,
  direction: 1,
  answers: initialAnswers,
  allergenNone: false,
};

function quizReducer(state: QuizState, action: QuizAction): QuizState {
  switch (action.type) {
    case "SET_GOAL":
      return {
        ...state,
        answers: { ...state.answers, goal: action.payload },
      };

    case "SET_REGION":
      return {
        ...state,
        answers: { ...state.answers, region: action.payload },
      };

    case "TOGGLE_SYMPTOM": {
      const sym = action.payload;
      if (sym === "none") {
        // "None of these" deselects everything else
        return {
          ...state,
          answers: { ...state.answers, symptoms: ["none"] },
        };
      }
      // Selecting anything else removes "none"
      const current = state.answers.symptoms.filter((s) => s !== "none");
      const next = current.includes(sym)
        ? current.filter((s) => s !== sym)
        : [...current, sym];
      return {
        ...state,
        answers: { ...state.answers, symptoms: next },
      };
    }

    case "SET_DIET":
      return {
        ...state,
        answers: { ...state.answers, dietPattern: action.payload },
      };

    case "TOGGLE_ALLERGEN": {
      if (action.payload === "none") {
        return {
          ...state,
          allergenNone: !state.allergenNone,
          answers: { ...state.answers, allergens: [] },
        };
      }
      const allergen = action.payload as Allergen;
      const current = state.answers.allergens;
      const next = current.includes(allergen)
        ? current.filter((a) => a !== allergen)
        : [...current, allergen];
      return {
        ...state,
        allergenNone: false,
        answers: { ...state.answers, allergens: next },
      };
    }

    case "SET_COOKING_TIME":
      return {
        ...state,
        answers: { ...state.answers, cookingTime: action.payload },
      };

    case "SET_COOKING_SKILL":
      return {
        ...state,
        answers: { ...state.answers, cookingSkill: action.payload },
      };

    case "SET_AGE":
      return {
        ...state,
        answers: { ...state.answers, ageRange: action.payload },
      };

    case "SET_STEP":
      return { ...state, step: action.payload, direction: 1 };

    case "NEXT_STEP": {
      const next = Math.min(state.step + 1, 8) as QuizStep;
      return { ...state, step: next, direction: 1 };
    }

    case "PREV_STEP": {
      const prev = Math.max(state.step - 1, 1) as QuizStep;
      return { ...state, step: prev, direction: -1 };
    }

    default:
      return state;
  }
}

// ---------------------------------------------------------------------------
// Animation variants
// ---------------------------------------------------------------------------

const variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 48 : -48,
    opacity: 0,
  }),
  center: { x: 0, opacity: 1 },
  exit: (direction: number) => ({
    x: direction > 0 ? -48 : 48,
    opacity: 0,
  }),
};

// ---------------------------------------------------------------------------
// Small reusable sub-components
// ---------------------------------------------------------------------------

interface OptionCardProps {
  selected: boolean;
  onClick: () => void;
  icon?: string;
  label: string;
  description?: string;
  color?: "forest" | "sage" | "clay" | "honey";
}

function OptionCard({
  selected,
  onClick,
  icon,
  label,
  description,
  color = "forest",
}: OptionCardProps) {
  const selectedClasses: Record<string, string> = {
    forest: "border-forest-500 bg-forest-50",
    sage: "border-sage-500 bg-sage-50",
    clay: "border-clay-500 bg-clay-50",
    honey: "border-honey-500 bg-honey-50",
  };
  const checkClasses: Record<string, string> = {
    forest: "bg-forest-500",
    sage: "bg-sage-500",
    clay: "bg-clay-500",
    honey: "bg-honey-500",
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "relative flex flex-col gap-1 rounded-xl border-2 p-4 text-left cursor-pointer transition-all duration-150",
        "hover:border-forest-300 hover:bg-forest-50/50",
        selected
          ? selectedClasses[color]
          : "border-border bg-white hover:border-forest-300"
      )}
    >
      {selected && (
        <span
          className={cn(
            "absolute right-3 top-3 h-5 w-5 rounded-full flex items-center justify-center",
            checkClasses[color]
          )}
        >
          <Check className="h-3 w-3 text-white" strokeWidth={3} />
        </span>
      )}
      {icon && <span className="text-2xl leading-none mb-1">{icon}</span>}
      <span className="text-sm font-semibold text-foreground leading-snug pr-6">
        {label}
      </span>
      {description && (
        <span className="text-xs text-muted-foreground">{description}</span>
      )}
    </button>
  );
}

interface CheckCardProps {
  checked: boolean;
  onToggle: () => void;
  label: string;
  note?: string;
}

function CheckCard({ checked, onToggle, label, note }: CheckCardProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={cn(
        "flex items-start gap-3 rounded-xl border-2 p-4 text-left cursor-pointer transition-all duration-150 w-full",
        checked
          ? "border-forest-500 bg-forest-50"
          : "border-border bg-white hover:border-forest-300 hover:bg-forest-50/50"
      )}
    >
      <span
        className={cn(
          "mt-0.5 h-5 w-5 flex-shrink-0 rounded border-2 flex items-center justify-center transition-colors",
          checked
            ? "bg-forest-500 border-forest-500"
            : "border-muted-foreground/40 bg-white"
        )}
      >
        {checked && <Check className="h-3 w-3 text-white" strokeWidth={3} />}
      </span>
      <span className="flex-1">
        <span className="text-sm font-medium text-foreground leading-snug">
          {label}
        </span>
        {note && (
          <span className="block text-xs text-muted-foreground italic mt-0.5">
            {note}
          </span>
        )}
      </span>
    </button>
  );
}

interface PillButtonProps {
  selected: boolean;
  onClick: () => void;
  label: string;
}

function PillButton({ selected, onClick, label }: PillButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full border-2 px-4 py-2 text-sm font-medium transition-all duration-150",
        selected
          ? "border-forest-500 bg-forest-500 text-white"
          : "border-border bg-white text-foreground hover:border-forest-300 hover:bg-forest-50"
      )}
    >
      {label}
    </button>
  );
}

// ---------------------------------------------------------------------------
// Step components
// ---------------------------------------------------------------------------

interface StepProps {
  state: QuizState;
  dispatch: React.Dispatch<QuizAction>;
}

function Step1Goal({ state, dispatch }: StepProps) {
  const goals: Array<{ value: QuizGoal; icon: string; label: string }> = [
    { value: "blood_sugar", icon: "🩸", label: "Control my blood sugar & energy" },
    { value: "belly_fat", icon: "🎯", label: "Reduce belly fat" },
    { value: "pcos", icon: "🌸", label: "Manage PCOS symptoms" },
    { value: "liver_health", icon: "🫀", label: "Improve liver health" },
    { value: "diabetes_risk", icon: "📊", label: "Reduce my diabetes risk" },
    { value: "just_learning", icon: "🥗", label: "Understand how to eat better" },
  ];

  return (
    <div className="space-y-4">
      <div>
        <p className="text-xs text-muted-foreground italic mb-4">
          Why we ask: Your primary goal shapes which condition profile and article set we match you to.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {goals.map((g) => (
          <OptionCard
            key={g.value}
            selected={state.answers.goal === g.value}
            onClick={() => dispatch({ type: "SET_GOAL", payload: g.value })}
            icon={g.icon}
            label={g.label}
          />
        ))}
      </div>
    </div>
  );
}

// Country subregion data
const US_REGIONS: USRegion[] = [
  "South",
  "Midwest",
  "Northeast",
  "Southwest",
  "West Coast",
  "Pacific Northwest",
];
const UK_REGIONS: UKRegion[] = [
  "England North",
  "England South",
  "Scotland",
  "Wales",
  "Northern Ireland",
];
const AU_STATES: Array<{ value: AUState; label: string }> = [
  { value: "NSW", label: "New South Wales" },
  { value: "VIC", label: "Victoria" },
  { value: "QLD", label: "Queensland" },
  { value: "WA", label: "Western Australia" },
  { value: "SA", label: "South Australia" },
];

function Step2Region({ state, dispatch }: StepProps) {
  const selectedCountry =
    state.answers.region?.country ?? null;

  function selectCountry(country: "US" | "UK" | "AU" | "Other") {
    if (country === "Other") {
      dispatch({ type: "SET_REGION", payload: { country: "Other" } });
    } else if (country === "US") {
      dispatch({
        type: "SET_REGION",
        payload: { country: "US", subregion: "Northeast" },
      });
    } else if (country === "UK") {
      dispatch({
        type: "SET_REGION",
        payload: { country: "UK", subregion: "England South" },
      });
    } else {
      dispatch({
        type: "SET_REGION",
        payload: { country: "AU", subregion: "NSW" },
      });
    }
  }

  const countries: Array<{
    value: "US" | "UK" | "AU" | "Other";
    icon: string;
    label: string;
  }> = [
    { value: "US", icon: "🇺🇸", label: "United States" },
    { value: "UK", icon: "🇬🇧", label: "United Kingdom" },
    { value: "AU", icon: "🇦🇺", label: "Australia" },
    { value: "Other", icon: "🌍", label: "Other / Not listed" },
  ];

  return (
    <div className="space-y-5">
      <p className="text-xs text-muted-foreground italic">
        Why we ask: Recipes use local store references and measurement units (cups/grams) based on your region.
      </p>
      <div className="grid grid-cols-2 gap-3">
        {countries.map((c) => (
          <OptionCard
            key={c.value}
            selected={selectedCountry === c.value}
            onClick={() => selectCountry(c.value)}
            icon={c.icon}
            label={c.label}
          />
        ))}
      </div>

      {/* Subregion selector animates in after country choice */}
      <AnimatePresence mode="wait">
        {selectedCountry && selectedCountry !== "Other" && (
          <motion.div
            key={selectedCountry}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="space-y-2"
          >
            <p className="text-sm font-semibold text-foreground">
              {selectedCountry === "US"
                ? "Which region of the US?"
                : selectedCountry === "UK"
                  ? "Which part of the UK?"
                  : "Which state?"}
            </p>
            <div className="flex flex-wrap gap-2">
              {selectedCountry === "US" &&
                US_REGIONS.map((r) => (
                  <PillButton
                    key={r}
                    label={r}
                    selected={
                      state.answers.region?.country === "US" &&
                      state.answers.region.subregion === r
                    }
                    onClick={() =>
                      dispatch({
                        type: "SET_REGION",
                        payload: { country: "US", subregion: r },
                      })
                    }
                  />
                ))}
              {selectedCountry === "UK" &&
                UK_REGIONS.map((r) => (
                  <PillButton
                    key={r}
                    label={r}
                    selected={
                      state.answers.region?.country === "UK" &&
                      state.answers.region.subregion === r
                    }
                    onClick={() =>
                      dispatch({
                        type: "SET_REGION",
                        payload: { country: "UK", subregion: r },
                      })
                    }
                  />
                ))}
              {selectedCountry === "AU" &&
                AU_STATES.map((s) => (
                  <PillButton
                    key={s.value}
                    label={s.label}
                    selected={
                      state.answers.region?.country === "AU" &&
                      state.answers.region.subregion === s.value
                    }
                    onClick={() =>
                      dispatch({
                        type: "SET_REGION",
                        payload: { country: "AU", subregion: s.value },
                      })
                    }
                  />
                ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Step3Symptoms({ state, dispatch }: StepProps) {
  const isLiverFocus = state.answers.goal === "liver_health";

  const symptomList: Array<{
    value: Symptom;
    label: string;
    note?: string;
    hideForLiver?: boolean;
  }> = [
    {
      value: "high_blood_sugar",
      label: "I've been told my blood sugar or HbA1c is higher than normal",
      note: "Links to prediabetes and insulin resistance patterns.",
    },
    {
      value: "high_blood_pressure",
      label: "I have high blood pressure (diagnosed or medicated)",
      note: "High blood pressure is part of the metabolic syndrome cluster.",
    },
    {
      value: "irregular_periods",
      label: "Irregular, infrequent, or missed periods",
      note: "Strongly associated with PCOS and hormonal insulin resistance.",
      hideForLiver: true, // hidden when liver_health goal is selected
    },
    {
      value: "acne_or_hair_growth",
      label: "Persistent acne or unwanted hair growth (face, abdomen, or back)",
      note: "Excess androgens, often driven by insulin resistance in PCOS.",
    },
    {
      value: "fatty_liver",
      label: "I've been told I have fatty liver or elevated liver enzymes",
      note: "Directly associated with NAFLD / MASLD and metabolic liver disease.",
    },
    {
      value: "high_triglycerides",
      label: "High triglycerides or low HDL cholesterol (from blood tests)",
      note: "A key marker in the metabolic syndrome cluster.",
    },
    {
      value: "dark_skin_patches",
      label: "Dark, velvety patches of skin (neck, armpits, or groin)",
      note: "Acanthosis nigricans — a visible sign of insulin resistance.",
    },
    {
      value: "family_history_diabetes",
      label: "Family history of type 2 diabetes",
    },
    {
      value: "energy_crashes",
      label: "Energy crashes or strong carb cravings after meals",
      note: "Postprandial glucose dysregulation is a hallmark of insulin resistance.",
    },
    { value: "none", label: "None of these apply to me" },
  ];

  const visible = symptomList.filter(
    (s) => !(isLiverFocus && s.hideForLiver)
  );

  return (
    <div className="space-y-3">
      <p className="text-xs text-muted-foreground">
        Select all that apply. Your answers are private and used only to personalise your results.
      </p>
      <div className="grid grid-cols-1 gap-2">
        {visible.map((s) => (
          <CheckCard
            key={s.value}
            checked={state.answers.symptoms.includes(s.value)}
            onToggle={() =>
              dispatch({ type: "TOGGLE_SYMPTOM", payload: s.value })
            }
            label={s.label}
            note={s.note}
          />
        ))}
      </div>
    </div>
  );
}

function Step4Diet({ state, dispatch }: StepProps) {
  const diets: Array<{ value: DietPattern; icon: string; label: string }> = [
    { value: "no_particular", icon: "🍽️", label: "No particular diet" },
    { value: "trying_healthier", icon: "🥦", label: "Trying to eat healthier" },
    { value: "low_carb", icon: "🥩", label: "Low-carb or keto" },
    { value: "mediterranean", icon: "🫒", label: "Mediterranean or plant-forward" },
    { value: "vegetarian", icon: "🌿", label: "Vegetarian" },
    { value: "vegan", icon: "🌱", label: "Vegan" },
  ];

  return (
    <div className="space-y-3">
      <p className="text-xs text-muted-foreground italic">
        Why we ask: We tailor recipe suggestions to align with your current eating pattern rather than asking you to change it overnight.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {diets.map((d) => (
          <OptionCard
            key={d.value}
            selected={state.answers.dietPattern === d.value}
            onClick={() =>
              dispatch({ type: "SET_DIET", payload: d.value })
            }
            icon={d.icon}
            label={d.label}
          />
        ))}
      </div>
    </div>
  );
}

function Step5Allergens({ state, dispatch }: StepProps) {
  const allergens: Array<{ value: Allergen; label: string }> = [
    { value: "gluten", label: "Gluten / wheat" },
    { value: "dairy", label: "Dairy" },
    { value: "eggs", label: "Eggs" },
    { value: "peanuts", label: "Peanuts" },
    { value: "tree_nuts", label: "Tree nuts" },
    { value: "soy", label: "Soy" },
    { value: "fish", label: "Fish" },
    { value: "shellfish", label: "Shellfish" },
    { value: "sesame", label: "Sesame" },
  ];

  const preferences: Array<{ value: Allergen; label: string }> = [
    { value: "halal", label: "Halal" },
    { value: "kosher", label: "Kosher" },
  ];

  function toggleItem(val: Allergen | "none") {
    dispatch({ type: "TOGGLE_ALLERGEN", payload: val });
  }

  return (
    <div className="space-y-5">
      <p className="text-xs text-muted-foreground italic">
        Why we ask: We filter every recipe recommendation for these. Select all that apply.
      </p>

      <div>
        <p className="text-sm font-semibold text-foreground mb-2">Allergies</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {allergens.map((a) => (
            <CheckCard
              key={a.value}
              checked={state.answers.allergens.includes(a.value)}
              onToggle={() => toggleItem(a.value)}
              label={a.label}
            />
          ))}
        </div>
      </div>

      <div>
        <p className="text-sm font-semibold text-foreground mb-2">
          Dietary Preferences
        </p>
        <div className="grid grid-cols-2 gap-2">
          {preferences.map((p) => (
            <CheckCard
              key={p.value}
              checked={state.answers.allergens.includes(p.value)}
              onToggle={() => toggleItem(p.value)}
              label={p.label}
            />
          ))}
        </div>
      </div>

      <CheckCard
        checked={state.allergenNone}
        onToggle={() => toggleItem("none")}
        label="None — no restrictions"
      />
    </div>
  );
}

function Step6Cooking({ state, dispatch }: StepProps) {
  const cookingTimes: Array<{ value: CookingTime; label: string }> = [
    { value: "under_20", label: "Under 20 min" },
    { value: "20_40", label: "20–40 min" },
    { value: "40_60", label: "40–60 min" },
    { value: "60_plus", label: "I enjoy longer sessions" },
  ];

  const skills: Array<{ value: CookingSkill; label: string }> = [
    { value: "beginner", label: "Complete beginner" },
    { value: "basics", label: "I know the basics" },
    { value: "confident", label: "Fairly confident" },
    { value: "experimental", label: "I love experimenting" },
  ];

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <p className="text-sm font-semibold text-foreground">
          How long do you usually have to cook on weekdays?
        </p>
        <div className="flex flex-wrap gap-2">
          {cookingTimes.map((t) => (
            <PillButton
              key={t.value}
              label={t.label}
              selected={state.answers.cookingTime === t.value}
              onClick={() =>
                dispatch({ type: "SET_COOKING_TIME", payload: t.value })
              }
            />
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <p className="text-sm font-semibold text-foreground">
          How comfortable are you in the kitchen?
        </p>
        <div className="flex flex-wrap gap-2">
          {skills.map((s) => (
            <PillButton
              key={s.value}
              label={s.label}
              selected={state.answers.cookingSkill === s.value}
              onClick={() =>
                dispatch({ type: "SET_COOKING_SKILL", payload: s.value })
              }
            />
          ))}
        </div>
      </div>

      <p className="text-xs text-muted-foreground italic">
        Why we ask: We match recipe complexity and timing to what's actually realistic for you.
      </p>
    </div>
  );
}

function Step7Age({ state, dispatch }: StepProps) {
  const ages: Array<{ value: AgeRange; label: string }> = [
    { value: "under_25", label: "Under 25" },
    { value: "25_34", label: "25–34" },
    { value: "35_44", label: "35–44" },
    { value: "45_54", label: "45–54" },
    { value: "55_64", label: "55–64" },
    { value: "65_plus", label: "65+" },
  ];

  return (
    <div className="space-y-4">
      <p className="text-xs text-muted-foreground italic">
        Why we ask: Metabolic risk and hormonal patterns shift significantly across age groups — this helps us surface the most relevant research.
      </p>
      <div className="flex flex-wrap gap-2">
        {ages.map((a) => (
          <PillButton
            key={a.value}
            label={a.label}
            selected={state.answers.ageRange === a.value}
            onClick={() =>
              dispatch({ type: "SET_AGE", payload: a.value })
            }
          />
        ))}
      </div>
    </div>
  );
}

interface Step8EmailProps extends StepProps {
  sessionId: string;
  onSubmit: (email: string) => Promise<void>;
  onSkip: () => void;
  isSubmitting: boolean;
}

function Step8Email({
  state,
  dispatch,
  onSubmit,
  onSkip,
  isSubmitting,
}: Step8EmailProps) {
  const [localEmail, setLocalEmail] = useState(state.answers.email ?? "");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const trimmed = localEmail.trim();
    if (!trimmed) {
      setError("Please enter your email address.");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmed)) {
      setError("Please enter a valid email address.");
      return;
    }
    // Sync to reducer before submitting (so session includes email)
    dispatch({ type: "SET_GOAL", payload: state.answers.goal ?? "just_learning" });
    await onSubmit(trimmed);
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <div className="text-4xl">📬</div>
        <p className="text-sm text-muted-foreground">
          Where should we send your recipe recommendations?
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="space-y-1.5">
          <label
            htmlFor="quiz-email"
            className="text-sm font-medium text-foreground"
          >
            Email address
          </label>
          <input
            id="quiz-email"
            type="email"
            autoComplete="email"
            value={localEmail}
            onChange={(e) => {
              setLocalEmail(e.target.value);
              setError(null);
            }}
            placeholder="you@example.com"
            className={cn(
              "w-full rounded-xl border-2 bg-white px-4 py-3 text-sm text-foreground",
              "focus:outline-none focus:ring-2 focus:ring-forest-300 focus:border-forest-400",
              "placeholder:text-muted-foreground/50",
              error ? "border-red-400" : "border-border"
            )}
          />
          {error && (
            <p className="text-xs text-red-500">{error}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={cn(
            "w-full rounded-xl px-6 py-3 text-sm font-semibold text-white transition-colors",
            "bg-forest-600 hover:bg-forest-700",
            "focus:outline-none focus:ring-2 focus:ring-forest-300 focus:ring-offset-2",
            "disabled:opacity-60 disabled:cursor-not-allowed"
          )}
        >
          {isSubmitting ? "Preparing your plan…" : "Send My Plan"}
        </button>
      </form>

      <div className="text-center space-y-2">
        <button
          type="button"
          onClick={onSkip}
          disabled={isSubmitting}
          className="text-sm text-muted-foreground underline underline-offset-2 hover:text-foreground transition-colors disabled:opacity-50"
        >
          Skip — show me my results
        </button>
        <p className="text-xs text-muted-foreground/70">
          No spam. Your data is never sold.
        </p>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Step validation — can the user advance from a given step?
// ---------------------------------------------------------------------------

function canAdvance(state: QuizState): boolean {
  const { step, answers } = state;
  switch (step) {
    case 1:
      return answers.goal !== null;
    case 2:
      // Must have selected a country; if not "Other", must also have a subregion
      // (subregion is always set when country is set in the reducer, so just check country)
      return answers.region !== null;
    case 3:
      // Must have at least one symptom selected (including "none")
      return answers.symptoms.length > 0;
    case 4:
      return answers.dietPattern !== null;
    case 5:
      // Allergens are optional — can always advance (either selected items or "None")
      return true;
    case 6:
      return answers.cookingTime !== null && answers.cookingSkill !== null;
    case 7:
      return answers.ageRange !== null;
    case 8:
      return true; // Email step has its own internal validation
    default:
      return false;
  }
}

// ---------------------------------------------------------------------------
// Step headings
// ---------------------------------------------------------------------------

const STEP_CONFIG: Record<
  QuizStep,
  { heading: string; subheading?: string }
> = {
  1: {
    heading: "What's your main health goal?",
    subheading: "Choose the one that matters most right now.",
  },
  2: {
    heading: "Where are you based?",
    subheading: "We use this for local store references and units of measurement.",
  },
  3: {
    heading: "Which of these apply to you?",
    subheading: "Select all that apply.",
  },
  4: {
    heading: "How would you describe your current diet?",
    subheading: "No judgement — this helps us meet you where you are.",
  },
  5: {
    heading: "Any allergies or dietary needs?",
    subheading: "We filter every recipe for these.",
  },
  6: {
    heading: "Tell us about your cooking reality",
    subheading: "Realistic recipes for your actual schedule.",
  },
  7: {
    heading: "What's your age range?",
    subheading: "Metabolic health looks different across life stages.",
  },
  8: {
    heading: "Your personalised plan is ready",
  },
};

// ---------------------------------------------------------------------------
// Main exported component
// ---------------------------------------------------------------------------

export function QuizStepper() {
  const router = useRouter();
  const [state, dispatch] = useReducer(quizReducer, initialState);
  const [sessionId, setSessionId] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Track previous step to determine animation direction
  const prevStepRef = useRef<QuizStep>(1);

  // Generate session ID once on mount — crypto.randomUUID() is browser-only
  useEffect(() => {
    setSessionId(crypto.randomUUID());
  }, []);

  const { step, answers } = state;
  const config = STEP_CONFIG[step];
  const progress = ((step - 1) / 7) * 100; // 0% at step 1, 100% at step 8

  function handleNext() {
    if (!canAdvance(state)) return;
    prevStepRef.current = step;
    dispatch({ type: "NEXT_STEP" });
  }

  function handleBack() {
    prevStepRef.current = step;
    dispatch({ type: "PREV_STEP" });
  }

  // Determine slide direction based on step delta
  const direction = step >= prevStepRef.current ? 1 : -1;

  async function handleEmailSubmit(email: string) {
    setIsSubmitting(true);
    const updatedAnswers: QuizAnswers = { ...answers, email };
    try {
      const result = await submitQuiz({
        sessionId,
        answers: updatedAnswers,
        email,
      });
      if (result.success) {
        router.push(`/quiz/results?session=${result.profileId}`);
      } else {
        // Non-fatal: fall through to skip behaviour
        console.error("Quiz submit failed:", result.error);
        handleSkip();
      }
    } catch (err) {
      console.error("Quiz submit error:", err);
      handleSkip();
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleSkip() {
    // Save answers to sessionStorage so the results page can decode them
    // without requiring a DB read. Falls back to generic results if storage fails.
    try {
      sessionStorage.setItem(
        `quiz_answers_${sessionId}`,
        JSON.stringify(answers)
      );
    } catch {
      // sessionStorage unavailable (e.g., private browsing with strict settings)
    }
    router.push(`/quiz/results?session=${sessionId}&skip=1`);
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Card */}
      <div className="bg-white rounded-3xl shadow-xl border border-forest-100 overflow-hidden">
        {/* Top gradient accent bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-forest-400 via-sage-400 to-honey-400" />

        {/* Progress bar */}
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
            Question {step} of 8
          </span>
          <span className="text-xs text-muted-foreground">
            {Math.round(progress)}% complete
          </span>
        </div>

        {/* Step content */}
        <div className="px-6 pb-6 min-h-[320px]">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={step}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.25, ease: "easeInOut" }}
            >
              {/* Heading */}
              <h2 className="text-2xl font-bold text-foreground mb-1">
                {config.heading}
              </h2>
              {config.subheading && (
                <p className="text-sm text-muted-foreground mb-5">
                  {config.subheading}
                </p>
              )}

              {/* Step body */}
              {step === 1 && <Step1Goal state={state} dispatch={dispatch} />}
              {step === 2 && <Step2Region state={state} dispatch={dispatch} />}
              {step === 3 && <Step3Symptoms state={state} dispatch={dispatch} />}
              {step === 4 && <Step4Diet state={state} dispatch={dispatch} />}
              {step === 5 && <Step5Allergens state={state} dispatch={dispatch} />}
              {step === 6 && <Step6Cooking state={state} dispatch={dispatch} />}
              {step === 7 && <Step7Age state={state} dispatch={dispatch} />}
              {step === 8 && (
                <Step8Email
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

        {/* Navigation footer — hidden on email step (has its own submit) */}
        {step !== 8 && (
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
            ) : (
              <div />
            )}

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
              {step === 7 ? "Almost done" : "Continue"}
              {step < 7 ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ArrowRight className="h-4 w-4" />
              )}
            </button>
          </div>
        )}
      </div>

      {/* Outside-card reassurance copy */}
      <p className="mt-4 text-center text-xs text-muted-foreground/70">
        Your answers are private. We never share or sell personal information.
      </p>
    </div>
  );
}
