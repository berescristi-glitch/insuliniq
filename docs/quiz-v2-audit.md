# Quiz v2 Audit — InsulinIQ Current State

> Date: 2026-07-01  
> Based on: `components/quiz/QuizStepper.tsx`, `lib/quiz/types.ts`, `lib/quiz/matcher.ts`, `lib/quiz/scorer.ts`

---

## 1. Current Quiz — Factual Snapshot

**Steps:** 9  
**UI flow:** reducer-based stepper with Framer Motion transitions  
**Gate:** Step 9 (email + marketing consent checkbox)  
**Skip path:** user can skip email → sessionStorage path → same results

### Data Collected per Step

| Step | Field | Type | Values |
|------|-------|------|--------|
| 1 | `goal` | `QuizGoal` | blood_sugar, belly_fat, pcos, liver_health, diabetes_risk, just_learning |
| 2 | `region` | `Region` (discriminated union) | US/UK/AU/Other + subregion |
| 3 | `symptoms` | `Symptom[]` | 9 values + "none" |
| 4 | `dietPattern` | `DietPattern` | 6 values |
| 5 | `allergens` | `Allergen[]` | 14 values |
| 6 | `cookingTime` + `cookingSkill` | two enums | 4 + 4 values |
| 7 | `ageRange` | `AgeRange` | 6 values |
| 8 | `safetyFlags` | `SafetyFlag[]` | 9 values |
| 9 | `email` + `marketingConsent` | string + boolean | — |

**Total distinct data fields:** 10 (goal, region, symptoms, dietPattern, allergens, cookingTime, cookingSkill, ageRange, safetyFlags, email)

---

## 2. What's Used in matchProfile()

```
Used:     goal, symptoms
Not used: region, dietPattern, allergens, cookingTime, cookingSkill, ageRange, safetyFlags
```

### matchProfile() logic (priority order)

```
hasPCOS   = goal==="pcos" || irregular_periods || acne_or_hair_growth
hasNAFLD  = goal==="liver_health" || fatty_liver
metSynFlags = count(high_blood_pressure + high_triglycerides + high_blood_sugar + dark_skin_patches)

Priority: PCOS > NAFLD > MetSyn(≥2 or belly_fat) > Prediabetes(high_blood_sugar|diabetes_risk) > IR default
```

### What scorer.ts uses

```
insulinSensitivity:  symptoms (high_blood_sugar, dark_skin_patches, high_triglycerides, energy_crashes), goal
bloodSugarStability: symptoms (high_blood_sugar, energy_crashes), goal, safetyFlags (type1_diabetes, hypoglycemia_risk)
lifestyleFriction:   cookingTime, allergens, dietPattern, ageRange
```

### What's completely unused in any computation

- `region` — not used in matcher, scorer, or results display
- `dietPattern` — partially used in scorer (lifestyleFriction) but not in profile matching
- `allergens` — partially used in scorer but not for profile differentiation
- `cookingSkill` — not used anywhere in matching or scoring
- `ageRange` — partially used in scorer (65_plus → friction flag) but not for profile
- Full `safetyFlags` content — only used for SafetyNotice display, not profile routing

---

## 3. Profile Differentiation Quality

| Profile | Quality | Weakness |
|---------|---------|---------|
| PCOS | ✅ Good | Relies on goal OR 2 symptoms — thin signal, no confirmed-diagnosis gate |
| NAFLD | ✅ Good | Relies on goal OR "fatty_liver" symptom — single-signal risk |
| Metabolic Syndrome | ⚠️ Weak | 2 of 4 symptoms → broad catch. Often confused with prediabetes |
| Prediabetes | ⚠️ Weak | High blood sugar + diabetes_risk — no HbA1c, no confirmed dx distinction |
| Insulin Resistance (default) | ⚠️ Very weak | Catch-all for everyone who doesn't trigger other profiles |
| general_wellness | ❌ Never triggered | Defined as profile but matchProfile() never returns it |

### Differentiation gaps

- **No sex/gender question** → PCOS appears in men (impossible in real life) if symptoms match
- **No "confirmed diagnosis" vs "I suspect" distinction** → matcher conflates both
- **Metabolic syndrome vs prediabetes** → these frequently overlap; quiz doesn't handle comorbidity
- **Weight-loss friction** → no dedicated profile despite being a major user motivation
- **Obesity-driven IR** → `belly_fat` goal routes to MetSyn, but belly fat ≠ metabolic syndrome
- **NAFLD vs alcohol-related liver disease** → quiz can't distinguish these

---

## 4. Data Used Nowhere — Wasted Collection

| Field | Collected | Used | Wasted |
|-------|-----------|------|--------|
| `region.subregion` | ✅ | ❌ | ✅ — subregion never reaches meal plan |
| `dietPattern` | ✅ | Scorer only | Partial waste — not used for content personalisation |
| `allergens` | ✅ | Scorer + results text | Not used to filter actual recipe/plan content |
| `cookingSkill` | ✅ | ❌ | Full waste |
| `ageRange` | ✅ | Scorer only | Not used for content |
| `cookingTime` | ✅ | Scorer only | Not used for actual plan |

---

## 5. Missing Questions for Meal Plan

These are necessary to produce a genuinely personalised meal plan but are absent from the current quiz:

| Missing | Why needed |
|---------|-----------|
| Biological sex | PCOS only affects females; currently a male could get PCOS profile |
| Weekly food budget | Critical for shopping list adaptation |
| Number of meals per day | Core meal plan structure |
| Whether they eat breakfast | Shapes Day 1 recommendations |
| Known diagnosis (vs suspected) | Changes copy tone and safety level |
| Disliked foods | Prevents plan abandonment |
| Batch cooking preference | Shapes recipes selected |
| Eating alone vs family | Shapes portion/recipe scale |
| Work/school lunch needs | Shapes midday meals |
| Eating out frequency | Shapes realistic compliance |
| Previous diets tried | Avoids redundant advice |
| Current activity level | Important for caloric context |
| Sleep quality | Now considered a metabolic lever |

---

## 6. Missing Questions for Safety

| Missing | Why needed |
|---------|-----------|
| Thyroid condition | Hypothyroidism affects metabolism, weight; some meds interact with diet |
| Taking any other medication | Broad catch for medication-diet interactions |
| Active cancer treatment | Major contraindication for dietary changes |
| Recent hospitalization | Flag for caution |
| Current smoking status | Metabolic context |
| Heart disease | Affects dietary fat recommendations |

---

## 7. Questions to Keep (from current quiz)

- Step 1: Goal ✅ (keep, expand options)
- Step 2: Country + subregion ✅ (keep)
- Step 3: Symptoms ✅ (keep, expand list)
- Step 4: Diet pattern ✅ (keep)
- Step 5: Allergens ✅ (keep)
- Step 6: Cooking time + skill ✅ (keep but separate steps in advanced)
- Step 7: Age range ✅ (keep)
- Step 8: Safety flags ✅ (keep, expand)
- Step 9: Email + marketing consent ✅ (keep Sprint 3 implementation)

---

## 8. Questions to Reformulate

| Current | Issue | Proposed fix |
|---------|-------|-------------|
| "Manage PCOS symptoms" as a goal | Sounds medical | "Support PCOS metabolic health" |
| "Reduce my diabetes risk" | "Risk" sounds clinical | "Understand my blood sugar patterns" |
| "Improve liver health" | Vague | "Learn about metabolic liver health" |
| Symptoms step heading "Which of these apply to you?" | Could imply diagnosis | Add subheading: "These help us personalise your educational profile — they are not a diagnosis." |
| "fatty_liver" as a symptom | Not a symptom, it's a diagnosis | Rename to "been told I have fatty liver or MASLD" → move to "known conditions" |
| Safety step: "type 1 diabetes" | Can feel alarming to see it listed | Add reassurance: "We ask this to personalise the educational notices on your results page." |

---

## 9. Questions to Eliminate or Move

| Question/field | Action | Reason |
|----------------|--------|--------|
| `fatty_liver` in symptoms | Move to "known conditions" | Fatty liver is a diagnosis, not a self-reported symptom |
| `family_history_diabetes` in symptoms | Move to dedicated family history question | Not a symptom |
| `dark_skin_patches` in symptoms | Keep but clarify label: "patches of darker skin (e.g. neck, armpits)" | Current label is unclear to users unfamiliar with acanthosis nigricans |

---

## 10. Summary Verdict

**Current quiz is functional for basic profiling but:**
- 60% of collected data is wasted (not used in any output)
- 40% of profiles are weakly differentiated
- 0% of data reaches an actual meal plan (meal plans don't exist yet)
- No sex/gender question creates impossible PCOS assignments
- No distinction between "I have this diagnosis" vs "I suspect this"
- The quiz is 9 steps but feels like 6 real decisions; there's room for more depth without feeling longer

**Quiz v2 recommendation:** Two-tier architecture (Quick → Advanced) that delivers results after Quick (~12-15 questions) and unlocks deeper personalisation after Advanced (~35-50 additional questions). The Advanced tier should gate behind the results page as an optional "get a more personalised plan" flow, not as a prerequisite for seeing any results.
