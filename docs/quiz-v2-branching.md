# Quiz v2 Branching Logic — InsulinIQ

> Date: 2026-07-01

---

## Quick Quiz Branching (Tier 1)

Quick Quiz branching is minimal — all 12 steps are shown to all users, with two conditional variations:

**C02 (subregion):** Only shown if C01 ≠ "Other"  
**D02 (biological sex):** Shows all options; result affects profile routing silently

No other branching in Quick Quiz — simplicity is the goal.

---

## Advanced Quiz Branching (Tier 2)

Advanced Quiz is fully branched. Sections are shown or hidden based on Quick Quiz profile assignment and specific answers.

---

### Branching Rule Set

#### PCOS Branch (Section M, parts 1–3)

**Show M01, M02, M03 when:**
```
profile === "pcos"
OR (dx_pcos selected in F01)
OR (irregular_periods in G01 AND sex !== "male")
```

**Hide when:**
- `sex === "male"` (PCOS biologically impossible)
- Profile is nafld with no PCOS signals

**M01, M02, M03 sequence:** always linear (no sub-branching within PCOS section)

---

#### NAFLD Branch (Section M, parts 4–5)

**Show M04, M05 when:**
```
profile === "nafld"
OR (dx_nafld selected in F01)
OR (goal === "liver_health")
OR (high_triglycerides + abdominal_weight + energy_crashes — 3+ signals)
```

**M05 (alcohol):** Always shown in NAFLD branch.  
**Display note:** Frame M05 as "We ask this because alcohol directly affects liver fat — this is educational context, not a judgement."  
**If alcohol ≥ 7/week:** Display content note: "Alcohol at this frequency may be a significant liver health factor. Our educational content covers both metabolic and alcohol-related patterns — however, if you're concerned about alcohol and your liver, speaking with your GP is the most important first step."

---

#### Prediabetes Branch (Section M, parts 6–7)

**Show M06, M07 when:**
```
profile === "prediabetes"
OR (dx_prediabetes selected in F01)
OR (dx_t2d selected in F01)
OR (high_blood_sugar in G01)
OR (goal === "diabetes_risk")
```

**M07 (doctor recommended):** If "Yes, recently" → note: "Your doctor has already flagged this — our educational content is designed to support the lifestyle guidance they gave you, not replace it."

---

#### Anthropometrics Branch (Section N)

**Show N01, N02, N03 to ALL Advanced users**  
(All optional, all have "prefer not to say")

**Special rule for N02 (weight):**  
- Do NOT calculate or display BMI anywhere in the UI
- Do NOT label any weight as "overweight" or "obese"
- Weight is used only for: caloric context in meal plan, protein target calculation, personalisation note

**Special rule for N03 (waist):**  
- Display reference ranges ONLY as educational context, NEVER as personal assessment
- "Waist measurements above certain thresholds are often associated with higher visceral fat" — do NOT say "your waist of X cm means you have metabolic syndrome"

---

#### Lab Values Branch (Section O)

**Show O01–O08 to ALL Advanced users** with "I don't know / not tested" as prominent default.

**Show O07 (ALT) prominently when:**
```
profile === "nafld" OR dx_nafld OR goal === "liver_health"
```

**Show O08 (TSH) when:**
```
dx_hypothyroid in F01 OR thyroid_condition in safetyFlags
```

**Lab value display on results:**
- Never auto-interpret as diagnosis
- Always: "You mentioned [marker] of [value]. This is in the range that [educational context about what this range is commonly associated with]. Always discuss your specific values with your healthcare provider."

---

#### Sleep & Stress (Section Q)

**Show to ALL Advanced users.**  
No branching within section.

**If Q-Q01 returns "Less than 5 hours":**  
Add to friction points: "Your sleep pattern may be affecting your metabolic health — poor sleep measurably reduces insulin sensitivity (Donga et al., 2010). Sleep is considered a primary metabolic variable, not just a lifestyle footnote."

**If Q-Q02 returns "Very high (chronically overwhelmed)":**  
Add to friction points: "Chronic stress raises cortisol, which directly raises blood glucose and impairs insulin signalling. Managing stress is increasingly viewed as a metabolic intervention."

---

#### Physical Activity (Section R)

**Show to ALL Advanced users.**

**If Q-R01 returns "Mostly sedentary":**  
Emphasise post-meal walking in starter steps. Frame as minimal-effort, maximal-return intervention.

**If Q-R02 includes "Resistance/weight training":**  
Add note in meal plan context: "Your resistance training is one of the most valuable things you can do for insulin sensitivity. Your plan emphasises protein adequacy to support this."

---

#### Meal Planning Context (Section S)

**Show to ALL Advanced users.**

**If Q-S01 returns "Whole family (mixed ages)":**  
Flag meal plan for family-friendly recipe selection. Note: "Insulin-sensitive meals are also good for the whole family — no separate cooking needed."

**If Q-S01 returns "I mainly eat out or buy ready meals":**  
Add eating-out guidance to Day 12. Prioritise supermarket ready-meal swaps in food swaps section.

**If Q-S03 returns "Yes, regularly" (batch cooking):**  
Adjust meal plan structure: batch prep day + reheat days format.

---

#### Barriers Branch (Section U–V)

**U02 (barriers):** Each barrier selected maps to an email day emphasis:

| Barrier selected | Email day emphasis |
|-----------------|-------------------|
| Hunger and cravings | Day 3 (protein satiety), Day 6 (hidden sugars) |
| Stress or emotions | Day 13 (sleep/stress metabolic connection) |
| Time and convenience | Day 9 (recipe), Day 12 (food swaps) |
| Cost | Day 12 (budget-friendly swaps) |
| Lack of results | Day 6 (visible vs invisible progress) |
| Didn't know where to start | Day 1 (why this profile matters) |

---

## Safety Flag Branching (all tiers)

Safety flags modify content but NEVER block the quiz or results.

### type1_diabetes OR takes_insulin

**In results:**
- Show SafetyNotice (CRITICAL level)
- Copy: "You indicated you have type 1 diabetes or take insulin. Dietary changes — especially reducing carbohydrate intake — can significantly affect your insulin requirements and hypoglycaemia risk. Please discuss any meal plan with your diabetes care team before making changes."
- Remove from friction points: any language about "cutting carbs" or "reducing starchy foods"
- Remove from plan days: any specific carb reduction language without medical qualifier

**In email nurture:**
- Add stronger disclaimer to every Day 1–7 email
- Replace "try reducing carbs" with "speak with your diabetes care team about how dietary changes may affect your management"
- has_safety_flags = true → modified email templates (Sprint 9)

---

### hypoglycemia_risk_medication

**In results:**
- SafetyNotice: "You take medication that can cause low blood sugar. Speak with your prescribing doctor before significantly changing your carbohydrate intake."
- Do NOT remove carb guidance entirely — just add medication interaction warning

---

### pregnant OR breastfeeding

**In results:**
- SafetyNotice: "Nutritional requirements during pregnancy and breastfeeding are specific and different from general metabolic health guidance. Please consult a registered dietitian or your midwife before making dietary changes."
- Remove from friction points: weight loss language
- Remove from plan: caloric deficit framing
- Add: "Focus on nutritional adequacy and variety rather than reduction"

---

### advanced_liver_disease

**In results:**
- SafetyNotice: "Advanced liver disease has specific protein and sodium requirements that differ significantly from standard metabolic health guidance. Please work with a hepatologist or specialist dietitian."
- Modify meal plan framing: avoid high-protein emphasis (cirrhosis may require protein restriction in some cases)

---

### kidney_disease

**In results:**
- SafetyNotice: "Kidney disease involves specific restrictions on protein, potassium, and phosphorus. Please consult a renal dietitian before making significant dietary changes."
- Modify meal plan: remove high-protein emphasis; flag high-potassium foods (avocado, bananas, tomatoes) with "check with your renal dietitian"

---

### eating_disorder_history

**In all content, results, and emails:**
- Remove ALL: calorie counts, caloric deficit framing, portion targets, weight loss predictions, BMI references
- Replace with: food quality focus, hunger awareness, regular eating patterns
- Do NOT show: before/after framing, scale-as-success metric

**In results page:**
- SafetyNotice: "You indicated a history of eating disorders. Some approaches commonly used in metabolic health — calorie tracking, meal restriction — can be triggering. Please work with a healthcare provider experienced in both eating disorders and nutrition."

---

### under_18

**In results:**
- SafetyNotice: "The educational content on this platform is designed for adults. If you are under 18, please discuss any dietary changes with a parent or guardian and a paediatric healthcare provider."
- Do NOT restrict access to educational content
- Do NOT show weight loss content

---

### heart_disease (new in v2)

**In results:**
- SafetyNotice: "You indicated you have heart disease. Significant dietary changes may interact with cardiovascular medications. Speak with your cardiologist or GP before starting any new dietary approach."

---

### thyroid_condition (new in v2)

**Content note (not safety level):** "Thyroid conditions can affect metabolic rate and energy. Our educational content explains the metabolic connections — however, thyroid conditions require specific medical management. Discuss any dietary changes with your endocrinologist."

---

## Branching State Machine Summary

```
Quick Quiz start
  → A01 consent confirmed
  → B01 goal selected
  → C01 country → [C02 subregion if not "Other"]
  → D01 age → D02 sex
  → E01 safety flags
  → F01 known conditions
  → G01 symptoms
  → H01 diet pattern
  → I01 allergens
  → J01 cooking time → J02 cooking skill
  → K01 budget
  → L01 email + consent
  → RESULTS (profile assigned)

Optional: "Get a more personalised plan →"
  → [M01-M03 if PCOS signals]
  → [M04-M05 if NAFLD signals]
  → [M06-M07 if prediabetes signals]
  → N01-N03 (all)
  → [O01-O08 based on profile]
  → P01-P04 (all)
  → Q01-Q02 (all)
  → R01-R02 (all)
  → S01-S04 (all)
  → T01-T03 (all)
  → U01-U02 (all)
  → V01 (all)
  → W01 (all)
  → ADVANCED RESULTS
```
