# Quiz v2 Scoring — Educational Signals

> Date: 2026-07-01  
> CRITICAL COMPLIANCE NOTE: These scores are NOT clinical assessments. They are educational pattern indicators derived from self-reported quiz answers. They must never be presented as diagnostic results, risk scores, or clinical probability estimates.

---

## Design Principles

1. **Never imply clinical measurement.** Use "signal" not "score". Use "attention level" not "risk level".
2. **Always disclaim.** Every score displayed to users must have visible non-diagnostic copy.
3. **Use directional language.** "Higher attention" not "high risk". "Within range" not "normal".
4. **Never interpret specific values.** "Your answers suggest some patterns associated with X" — not "You have X".
5. **Never calculate without "I don't know" handling.** If a user doesn't answer, the signal defaults to neutral, not zero.

---

## Signal 1 — Insulin Sensitivity Signal

**Display name:** Insulin Sensitivity Signal  
**Levels:** Low Attention / Moderate Attention / Higher Attention  
**Disclaimer:** "Based on self-reported quiz answers. Not a blood test result."

### What it measures
Pattern indicators from self-reported symptoms and goals suggesting the degree to which the user's quiz answers align with educational descriptions of insulin sensitivity challenges.

### Questions that influence this signal

| Question | Field | Weight |
|----------|-------|--------|
| G01: high_blood_sugar symptom | +2 | Strong signal |
| G01: dark_skin_patches (acanthosis nigricans) | +2 | Moderate signal (Brickman 2010) |
| G01: high_triglycerides | +1 | Associated (Grundy 2016) |
| G01: energy_crashes | +1 | Associated with post-meal glucose variability |
| G01: weight_resistant | +1 | Associated with insulin-driven fat storage |
| B01: goal === diabetes_risk | +2 | User-stated concern |
| B01: goal === belly_fat | +1 | Abdominal fat associated with IR |
| F01: dx_ir confirmed | +3 | Confirmed diagnosis |
| F01: dx_prediabetes confirmed | +2 | Confirmed blood sugar pattern |
| O01: fasting glucose 100–125 mg/dL (Advanced) | +3 | Direct signal |
| O03: fasting insulin elevated (Advanced) | +3 | Direct signal |

### Calculation

```
irScore = sum of applicable weights

if irScore >= 5: "elevated_attention"
if irScore >= 2: "moderate_attention"
else:            "low_attention"
```

### What this signal is NOT
- Not a HOMA-IR calculation
- Not a diagnosis of insulin resistance
- Not a probability estimate
- Not a clinical risk score

### Display copy
"This educational indicator reflects patterns in your quiz answers that are commonly associated with discussions of insulin sensitivity in the metabolic health literature. It is not a measurement from a blood test or clinical assessment."

---

## Signal 2 — Blood Sugar Stability Signal

**Display name:** Blood Sugar Stability Signal  
**Levels:** Low Attention / Moderate Attention / Higher Attention  
**Disclaimer:** "Based on your quiz answers. Not a glucose measurement or HbA1c result."

### What it measures
How many of the user's self-reported answers align with educational patterns associated with blood sugar fluctuation or instability.

### Questions that influence this signal

| Question | Field | Weight |
|----------|-------|--------|
| G01: high_blood_sugar | +2 | Direct signal |
| G01: energy_crashes | +2 | Associated with post-meal glucose drops |
| G01: cravings_sugary | +1 | Associated with reactive glucose patterns |
| G01: frequent_hunger (new) | +1 | Associated with rapid glucose return |
| B01: goal === blood_sugar | +2 | User-stated concern |
| B01: goal === diabetes_risk | +2 | User-stated concern |
| E01: type1_diabetes | +3 | Direct blood sugar condition |
| E01: hypoglycemia_risk_medication | +2 | Blood sugar-affecting medication |
| F01: dx_prediabetes | +3 | Confirmed pattern |
| F01: dx_t2d | +3 | Confirmed condition |
| O01: fasting glucose elevated (Advanced) | +3 | Direct signal |
| O02: HbA1c elevated (Advanced) | +3 | Direct signal |
| P02: cravings after meals (Advanced) | +1 | Behavioral signal |
| Q01: sleep < 6 hours (Advanced) | +1 | Sleep reduces insulin sensitivity (Donga 2010) |

### Calculation

```
bgScore = sum of applicable weights

if bgScore >= 5: "elevated_attention"
if bgScore >= 2: "moderate_attention"
else:            "low_attention"
```

### What this signal is NOT
- Not a fasting glucose measurement
- Not an HbA1c reading
- Not a glucose tolerance test result

### Display copy
"This indicator reflects patterns in your self-reported answers that are commonly associated with blood sugar variability in educational metabolic health frameworks. It is not derived from any blood test or clinical measurement."

---

## Signal 3 — Lifestyle Friction Signal

**Display name:** Lifestyle Friction Signal  
**Levels:** Low Attention / Moderate Attention / Higher Attention  
**Disclaimer:** "Based on your quiz answers about daily habits and practical constraints."

### What it measures
How many practical and lifestyle constraints the user has indicated — factors that research suggests make consistent dietary change harder to sustain. Higher friction does not mean failure; it means the plan needs to address these constraints explicitly.

### Questions that influence this signal

| Question | Field | Weight |
|----------|-------|--------|
| J01: cookingTime === "under_20" | +2 | Time constraint |
| J01: cookingTime === "20_40" with allergens | +1 | Time + complexity |
| I01: allergens.length >= 2 | +1 | Dietary complexity |
| I01: allergens.length >= 1 && dietPattern === "no_particular" | +1 | Restriction without foundation |
| H01: dietPattern === "no_particular" | +1 | No existing framework |
| D01: ageRange === "65_plus" | +1 | Age-related considerations |
| G01: family_history | +0.5 | Background concern |
| K01: budget === "low" | +1 (Advanced / v2) | Economic constraint |
| S01: whole family / mainly eats out | +1 (Advanced) | Social constraint |
| S02: eats out 4+ times/week | +1 (Advanced) | Convenience constraint |
| U02: barriers ≥ 2 selected | +1 per extra barrier (Advanced) | Multiple constraints |
| Q02: stress "very high" | +1 (Advanced) | Stress as adherence barrier |

### Calculation

```
frictionScore = sum of applicable weights

if frictionScore >= 4: "elevated_attention"
if frictionScore >= 1: "moderate_attention"
else:                  "low_attention"
```

### What higher friction means (and doesn't mean)
Higher friction = the plan needs more practical scaffolding, simpler recipes, more flexible options, more acknowledgement of real-world constraints.  
Higher friction does NOT mean "harder to improve metabolic health" or "less likely to succeed."

### Display copy
"This indicator reflects the practical constraints you've described — time, budget, cooking skill, dietary needs. A higher signal means your plan needs to work harder to fit your real life. It does not predict your outcomes."

---

## Signal 4 — Meal Structure Signal (NEW in v2, Advanced tier)

**Display name:** Meal Structure Signal  
**Levels:** Well-structured / Some gaps / Less structured  
**Disclaimer:** "Based on your self-reported eating patterns."

### What it measures
How closely the user's current eating pattern aligns with the meal structure principles described in metabolic health literature: regular timing, protein at each meal, vegetable inclusion, avoidance of long fasting windows.

### Questions that influence this signal (Advanced tier only)

| Question | Weight |
|----------|--------|
| P01: 3 meals vs grazing/irregular | +1 or -1 |
| P04: breakfast timing (regular) | +1 |
| P03: eating speed (slow-moderate) | +0.5 |
| H01: mediterranean or trying_healthier | +1 |
| R01: moderately/very active | +0.5 |
| Q01: 7–8 hours sleep | +0.5 |

### Calculation
Score → map to one of three display levels. Does not appear in Quick Quiz results (Advanced only).

---

## Signal 5 — Safety Attention Flag

**Not displayed as a bar/score.** Binary: triggers SafetyNotice if any safety flag is present.

**Logic:**
```
if safetyFlags.length > 0: show SafetyNotice (profile-specific copy)
if has_safety_flags: modify email copy (no restriction language)
```

**Display:** Always appears before any paid CTA (compliance requirement from CLAUDE.md).

---

## Signal 6 — Personalization Completeness Score

**Not shown to users.** Internal signal used by the system.

**Purpose:** Tells the results page and meal plan engine how much personalization is possible given the data provided.

```
completenessScore: 0–100

Quick Quiz only:              0–40
+ condition branch answered:  +15
+ anthropometrics provided:   +10
+ lab values provided:        +20
+ advanced sections complete: +15

At completeness < 40: show "Complete advanced profile for a more personalised plan" CTA
At completeness 40–70: show "Your plan is personalised to your profile — advanced answers would refine it further"
At completeness > 70: show "Your plan is highly personalised based on your detailed answers"
```

**Why it's internal:** Showing users a "completeness" percentage can create anxiety or feel like the quiz is judging them. Better to express it through the CTA copy.

---

## Score Display Rules

### Results page display (S2 — Metabolic Snapshot)
- Show: Insulin Sensitivity Signal, Blood Sugar Stability Signal, Lifestyle Friction Signal
- Always show: microcopy "Educational indicators based on your quiz answers. Not a blood test result."
- Always show at bottom: "These signals are pattern-matched from your self-reported answers — not derived from laboratory data. Always discuss your actual metabolic markers with a qualified healthcare provider."

### What is NEVER shown
- Numerical score values (e.g. "7/10")
- Risk percentages
- "High risk" or "Low risk" labels
- Clinical probability estimates
- BMI
- Any comparison to clinical cutoffs without full disclaimer

### What Advanced results add (Sprint 8)
- Meal Structure Signal (bar)
- Personalization Completeness CTA (text, not bar)
- Lab-value educational context if provided (NOT displayed as a signal bar — shown as educational text only)
