# Quiz v2 Implementation Plan — InsulinIQ

> Date: 2026-07-01  
> Architecture decision: Two-tier (Quick → Results → Advanced), additive, backward compatible.  
> The v1 quiz remains live throughout development. v2 launches as a new route.

---

## Guiding Principle

> Ship Quick Quiz first. Validate conversion. Then add Advanced.  
> Never delay results to collect more data. Data depth comes after the user sees value.

---

## Sprint 5 — Quick Quiz v2 UI

**Goal:** Replace or augment the current 9-step quiz with the new 12-step Quick Quiz. The v1 quiz route stays available as fallback.

**Estimated effort:** 2–3 weeks

### New files
```
lib/quiz/types-v2.ts              → QuizAnswersV2, extended types
lib/quiz/matcher-v2.ts            → matchProfileV2(), handles sex + known conditions
lib/quiz/scorer-v2.ts             → extended scorer with new symptoms
components/quiz/QuizStepperV2.tsx → 12-step stepper (replaces QuizStepper.tsx or new route)
app/quiz-v2/page.tsx              → new route /quiz-v2 (shadow before replacing /quiz)
```

### Changed files
```
actions/quiz.ts          → accept QuizAnswersV2 shape; backward compatible
types/database.ts        → add profile_confidence, quiz_version to quiz_results
```

### DB changes
```sql
ALTER TABLE quiz_results 
  ADD COLUMN IF NOT EXISTS profile_confidence TEXT,
  ADD COLUMN IF NOT EXISTS quiz_version TEXT DEFAULT 'v1';
```

### New questions vs v1
| Change | Action |
|--------|--------|
| Add sex (Q-D02) | New step between age and safety |
| Add known conditions (Q-F01) | New step, replaces "fatty_liver" in symptoms |
| Expand symptoms list to 15 | Modify Step3 options |
| Add budget (Q-K01) | New step after cooking |
| Expand safety flags (3 new) | Modify Step8 options |
| Reformulate goal options (add weight_loss_friction) | Modify Step1 options |

### matchProfileV2() changes
- Add sex gate: PCOS requires sex !== "male"
- Add known conditions as strong match signal
- Add weight_loss_friction profile routing
- Add profile confidence calculation
- All v1 profiles remain valid

### Risks
- Adding steps increases completion drop-off: mitigate with clear "why we ask" text on each new step
- sex question may feel sensitive: mitigate with clear "optional + prefer not to say" and reassurance copy
- known conditions step may trigger anxiety: mitigate with "optional, no judgement" framing

### Success criteria
- All 7 profiles correctly assignable from Quick Quiz
- PCOS profile never assigned to male users
- Weight loss friction profile correctly triggered
- Profile confidence correctly calculated (high/medium/low)
- All v1 session data still processable
- Build passes, no TypeScript errors

### What to test
- All 7 profile routing combinations
- Sex=male + PCOS symptoms → no PCOS profile
- Skip path works with v2 answers
- Budget field survives sessionStorage round-trip
- Safety flags (3 new) trigger correct notices

---

## Sprint 6 — Advanced Personalization UI

**Goal:** Implement the Advanced Quiz sections (M–W) as an optional flow post-results.

**Estimated effort:** 3–4 weeks

### New files
```
components/quiz/AdvancedQuizStepper.tsx  → branching stepper for sections M–W
app/quiz/advanced/page.tsx               → route /quiz/advanced?session=...
lib/quiz/advanced-matcher.ts             → refine profile with advanced data
lib/quiz/meal-plan-constraints.ts        → compute MealPlanConstraints from answers
```

### DB changes
```sql
-- Create quiz_results_advanced table (see data-schema.md for full DDL)
```

### Branching logic
PCOS branch (M01–M03) shown when: profile === "pcos" or PCOS signals present  
NAFLD branch (M04–M05) shown when: profile === "nafld"  
Prediabetes branch (M06–M07) shown when: profile === "prediabetes"  
All other sections: shown to all Advanced users (with per-question optional)

### Results page changes
- Add "Complete your profile for a more personalised plan" CTA after the basic results
- CTA links to /quiz/advanced?session=[current_session]
- After Advanced completion: results page refreshes with "Your advanced profile" indicator

### Risks
- Lab values section may be misinterpreted as diagnostic: mitigate with strong framing throughout
- Free text (disliked foods) requires sanitization
- Advanced session must link to same session_id as Quick Quiz

### Success criteria
- All Advanced sections render correctly based on branching rules
- Lab values stored but NOT displayed as clinical metrics
- Personalization completeness score calculated correctly
- MealPlanConstraints object computed and stored

---

## Sprint 7 — Meal Plan Personalization Engine

**Goal:** Use MealPlanConstraints to generate personalised 21-day plan content.

**Estimated effort:** 4–6 weeks

### Approach
This sprint builds the constraint-satisfaction layer, not a full meal plan engine. The initial version selects from a curated recipe library (already partially built in data/food-research/) using constraint matching.

### New files
```
lib/meal-plan/engine.ts           → takes MealPlanConstraints → selects recipes per day
lib/meal-plan/recipe-filter.ts    → filters recipe library by constraints
lib/meal-plan/shopping-list.ts    → generates shopping list from selected recipes
data/recipes/                     → curated recipe library (new content sprint)
```

### Recipe library requirement
Minimum for launch:
- 40 recipes × US/UK/AU variants = 120 recipe files
- Breakfast: 10 base recipes
- Lunch: 10 base recipes
- Dinner: 10 base recipes
- Snacks: 10 base recipes

Each recipe must include: name, country variant, prep time, allergen flags, diet tags, metabolic profile tags, ingredients (with store-specific alternatives), instructions, estimated protein/fibre/carbs.

### Success criteria
- Given any QuizAnswersV2 + QuizAnswersAdvanced, can generate a valid 21-day structure
- All allergen constraints respected
- Budget constraints respected
- Region constraints respected (no US store names in UK plan)
- Safety flag constraints respected (no calorie content shown if eating_disorder_history)

---

## Sprint 8 — Results Page v2 Integration

**Goal:** Results page reads Advanced data when available and shows enhanced personalisation.

**Estimated effort:** 2–3 weeks

### Changes to results page
- S2 (Metabolic Snapshot): add Meal Structure Signal if Advanced data present
- S3 (Friction Points): dynamically generated from answers (not static per profile) using advanced barrier data
- S5 (First 7 Days): show actual recipe preview for Day 1–3 based on MealPlanConstraints
- S6 (Unlock Your Full Plan): update feature checklist to reflect actual plan contents

### Personalization note update
Current: "Because you selected UK, limited cooking time, and gluten-free needs..."
v2: Extended with budget, group cooking, barriers identified from Advanced answers

### Success criteria
- Results page correctly distinguishes v1/Quick-only vs Advanced-complete sessions
- Friction points dynamically generated match the user's actual answers
- Day 1–3 recipe previews are valid for the user's allergen/diet constraints

---

## Sprint 9 — Email Segmentation v2

**Goal:** Route nurture emails to profile-specific template variants using Sprint 3 framework.

**Estimated effort:** 2–3 weeks

### Changes
- Update `lib/resend/emails.ts`: add profile-specific template variants for days 1–14
- Use `metabolic_profile` column in `newsletter_subscribers` to select template
- Add barrier-specific content modification (from `dieting_barriers` stored in advanced)
- Add safety-flag-aware content (from `has_safety_flags`)
- Extend nurture sequence from 14 days to 21 days
- Update `NURTURE_TOTAL_DAYS = 21` in cron

### Template priority
First implementation: PCOS vs general variants (2 tracks)  
Second: NAFLD, prediabetes tracks  
Third: Full 6-profile tracks

### Success criteria
- PCOS subscribers get PCOS-specific email subjects and content
- has_safety_flags subscribers never receive restriction-framing copy
- 21-day cron verified end-to-end with test subscriber

---

## Sprint 10 — Monthly Check-In / Retention Quiz

**Goal:** A shorter (5-question) monthly check-in that updates the user's profile and generates a personalised monthly report.

**Estimated effort:** 2–3 weeks

### Structure
Monthly check-in questions:
1. How are your energy levels compared to when you started?
2. How consistent have you been with protein at meals?
3. What has been the biggest friction this month?
4. Any new symptoms or changes to report?
5. One thing you want to focus on next month?

### Output
- Updated profile signals
- Month-over-month comparison (qualitative, not clinical)
- "Your month in focus" educational summary email
- Updated meal plan constraints if preferences changed

### Success criteria
- Check-in available to active subscribers in dashboard
- Responses stored and linked to original session
- Monthly summary email generated

---

## What NOT To Build in This Architecture Phase

- ❌ Do not implement a full AI meal plan generator (Sprint 7 uses constraint-matching, not LLM generation)
- ❌ Do not implement real-time glucose tracking integration
- ❌ Do not build a medical symptom checker
- ❌ Do not promise features not yet built in the quiz copy
- ❌ Do not launch Advanced quiz before Quick Quiz v2 is validated
- ❌ Do not merge Advanced answers into the v1 results page (extension only)

---

## Milestone Summary

| Sprint | Deliverable | Gate for next |
|--------|-------------|---------------|
| Sprint 5 | Quick Quiz v2 with 7 profiles + confidence | A/B test vs v1 |
| Sprint 6 | Advanced Quiz UI + DB storage | Recipe library ready |
| Sprint 7 | Meal Plan Engine (constraint-matching) | 40+ recipes catalogued |
| Sprint 8 | Results Page v2 with advanced personalisation | Sprint 7 complete |
| Sprint 9 | Profile-segmented email tracks | 14-day templates per profile written |
| Sprint 10 | Monthly Check-In | Active subscriber base |
