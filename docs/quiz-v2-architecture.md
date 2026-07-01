# Quiz v2 Architecture — InsulinIQ

> Date: 2026-07-01  
> Decision: Two-tier system — Quick Quiz → Results → Optional Advanced Personalization

---

## Design Philosophy

> Quick Quiz delivers results and converts. Advanced Personalization deepens them.

The key insight from conversion research: users who see a personalised result **before** being asked 60 questions are far more likely to complete the longer form. Gating Advanced behind results means:

1. Every user gets a profile → first value delivered immediately
2. Users who care about personalisation voluntarily go deeper
3. Deep data comes from engaged users → better meal plan quality
4. Email capture happens at the Quick Quiz gate → full funnel still works at step 15

This is not a compromise. It is the architecturally correct design.

---

## Tier 1 — Quick Metabolic Profile

### Goal
Give every user a meaningful educational profile in under 5 minutes. Capture enough for:
- Profile assignment (all 7 profiles)
- Safety flags
- Safety notice display
- Region + allergen filtering (basic)
- Email funnel segmentation
- Pricing recommendation

### Target: 12–15 UI steps (not all steps are single questions)

**Estimated completion time:** 3–5 minutes

### Quick Quiz Sections

```
Section A — Health Data Consent           (1 step)
Section B — Main Goal                     (1 step)
Section C — Country + Region              (1 step, conditional subregion)
Section D — Age + Sex                     (1 step, two fields)
Section E — Safety Screening              (1 step, multi-select)
Section F — Known Conditions              (1 step, multi-select — NEW)
Section G — Symptoms & Daily Signals      (1 step, multi-select, expanded)
Section H — Current Eating Pattern        (1 step)
Section I — Food Restrictions & Allergens (1 step, multi-select)
Section J — Cooking Reality               (1 step, combined time + skill)
Section K — Weekly Food Budget            (1 step, per-country — NEW)
Section L — Email + Marketing Consent     (1 step)
```

**Total Quick Quiz: 12 UI steps (~15 questions)**

---

## Tier 2 — Advanced Personalization

### Goal
Collect enough data to generate a genuinely personalised 21-day meal plan, shopping list, food swaps, and email funnel segment. Users access this AFTER seeing their Quick Quiz results, via a clear CTA: "Get a more personalised plan — takes 8–12 more minutes."

**Estimated completion time:** 8–12 minutes additional

### Advanced Quiz Sections (added after Quick results shown)

```
Section M — Condition Deep Dive           (branching: PCOS / NAFLD / prediabetes)
Section N — Anthropometrics               (optional: height, weight, waist)
Section O — Optional Lab Values           (optional: HbA1c, fasting glucose, etc.)
Section P — Eating Behavior               (hunger, cravings, meal timing)
Section Q — Sleep & Stress                (sleep hours, stress level)
Section R — Physical Activity             (type, frequency, duration)
Section S — Practical Meal Planning       (batch cooking, work meals, eating out)
Section T — Food Preferences              (liked/disliked, cultural, cuisine)
Section U — Previous Approaches           (diets tried, what worked/didn't)
Section V — Readiness & Motivation        (barriers, support system)
Section W — Output Preferences            (how they want info: visual/text, metric/imperial)
```

**Total Advanced additions: ~40–50 questions**  
**Total Quiz v2 (both tiers): ~55–65 questions**

---

## User Flow Diagram

```
Landing / Quiz Start
        ↓
[Consent — Section A]
        ↓
[Quick Quiz — Sections B–K]
  12 UI steps / ~15 questions
        ↓
[Email + Consent Gate — Section L]
  (skip still possible → sessionStorage path)
        ↓
[Results Page v2]
  • Profile assigned
  • Educational Metabolic Profile shown
  • Metabolic Snapshot (3 signal bars)
  • First 3 days of plan
  • SafetyNotice if flagged
  • MedicalDisclaimer before CTA
        ↓
[Optional: "Personalise Further" CTA]
  "Get a more accurate plan — takes ~10 more minutes"
        ↓
[Advanced Quiz — Sections M–W]
  Branched, only relevant sections shown
        ↓
[Advanced Results / Plan Preview]
  • More precise profile
  • 21-day plan preview unlocked
  • Pricing CTA with full profile context
```

---

## Architectural Rules

### Rule 1: Results first, data second
Users must see value (results page) BEFORE being asked for advanced data. No advance-gating.

### Rule 2: Everything optional except the minimum
Required fields in Quick Quiz: goal, country, safety flags (can answer "none"), email or skip.
Everything else is optional with "prefer not to say" or "I don't know" available.

### Rule 3: Consent before health data
Health-data consent (Section A) must appear before any question that collects health-related information. This applies especially to:
- Known conditions
- Safety flags  
- Lab values
- Anthropometrics

### Rule 4: Safety flags never block, always inform
Safety flags: never block the quiz, never refuse to show results. Always add a SafetyNotice on the results page. Never add a CTA that contradicts the safety notice.

### Rule 5: No clinical framing
No "risk score", no "probability of having X", no "your clinical profile". All outputs are educational profiles, not diagnostic assessments.

### Rule 6: Session-based, not account-based (for now)
Quiz v2 results are stored in `quiz_results` by session_id. No login required. Advanced quiz results extend the same session.

### Rule 7: Profile is always provisional
Every profile display must include "This is an educational profile based on your self-reported answers. It is not a clinical assessment or a diagnosis."

---

## Profile Assignment Architecture

### Quick Quiz → Profile (immediate)
All 7 profiles are assignable from Quick Quiz data alone. Profile assigned at end of Section L.

### Advanced Quiz → Profile Refinement
Advanced data refines the profile without replacing it. The same profile key is retained; additional context (e.g. confirmed_diagnosis flag, specific lab values) is stored separately for meal plan generation.

### Profile Keys (unchanged from v1)
`pcos` | `nafld` | `prediabetes` | `metabolic_syndrome` | `insulin_resistance` | `general_wellness`

**New in v2:** `weight_loss_friction` — a new profile for users whose primary signal is repeated failed weight loss attempts without clear metabolic diagnosis.

---

## Data Architecture

### Quick Quiz data → `quiz_results.answers` (existing table)
Extended `QuizAnswers` type v2 stores all Quick Quiz fields.

### Advanced Quiz data → `quiz_results_advanced` (new table, Sprint 5+)
Separate table, linked by `session_id`. Contains:
- Condition deep-dive answers
- Anthropometrics
- Lab values
- Eating behavior
- Meal planning preferences

### Meal Plan Constraints → `meal_plan_constraints` (computed, Sprint 7+)
Derived from both Quick + Advanced answers. Feeds the meal plan engine.

---

## TypeScript Type Strategy

### v1 types (backward compatible): keep `QuizAnswers` in `lib/quiz/types.ts`
### v2 extension: new file `lib/quiz/types-v2.ts`
### No breaking changes to existing quiz path until Sprint 5 replaces the stepper

---

## Conversion Architecture

### Primary conversion funnel
```
Quiz → Email gate → Results → Pricing CTA
```

### Secondary conversion funnel (Advanced)
```
Results → "Get More Personalised Plan" → Advanced Quiz → Advanced Results → Pricing CTA v2
```

Advanced CTA has stronger conversion signal because the user has:
1. Already seen value (basic results)
2. Voluntarily invested more time (Advanced Quiz)
3. A more complete profile → more specific pricing recommendation

---

## What Does NOT Change in Quiz v1 → v2 Transition

- `matchProfile()` function logic (backward compatible)
- `enrollInNurture()` function
- `submitQuiz()` action
- `quiz_results` DB table
- `MetabolicProfile` type (add new value, don't change existing)
- Results page (extend, don't replace)
- Email nurture sequence (extend, don't replace)

All v2 additions are **additive**. The v1 quiz can remain live during v2 development.
