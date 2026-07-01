# Quiz v2 Profile Mapping — InsulinIQ

> Date: 2026-07-01

---

## Profile 1 — PCOS Metabolic Support

**Profile key:** `pcos`  
**Color:** sage  
**Email funnel:** PCOS-specific 21-day sequence

### Primary match criteria (Quick Quiz)
- `goal === "pcos"` → auto-assign
- `dx_pcos` selected in known conditions → strong match
- `irregular_periods` + `acne_or_hair_growth` in symptoms → strong match
- `sex === "female" || sex === "intersex" || sex === "prefer_not_to_say"` → REQUIRED (cannot assign PCOS if sex === "male")

### Secondary criteria (boost confidence)
- `goal === "belly_fat"` + female + `irregular_periods`
- `high_triglycerides` + `irregular_periods`
- `weight_resistant` + `irregular_periods` + female

### Exclusion rules
- `sex === "male"` → PCOS profile blocked regardless of other signals
- `dx_t2d` → if confirmed T2D, route to prediabetes/IR profile instead, add PCOS as comorbidity note

### Advanced criteria (boost precision)
- M01: PCOS diagnosed → confirmed_pcos flag
- M02: irregular cycle → stronger PCOS signal
- M03: elevated androgens → highest confidence PCOS

### Friction points
- Insulin-driven cravings (Crofts et al., 2015)
- Weight resistance despite standard approaches (Sam, 2007)
- Energy peaks and crashes
- Irregular cycle complicating habit formation
- Frustration with "just lose weight" advice

### Starter steps
- Protein-anchor breakfast (evidence: Douglas et al., 2022; Wolever et al., 1988)
- Vegetables before carbohydrates (Shukla et al., 2017)
- Post-meal 10-minute walk (Buffey et al., 2022)

### Content hub
`/pcos`

### Pricing recommendation
`?recommended=core&profile=pcos`

### Email segment
`pcos` → PCOS_NURTURE framework in nurtureProfiles.ts

### Safety overlays
- `takes_insulin`: add note about insulin-dose interaction with dietary changes
- `eating_disorder_history`: avoid calorie/restriction framing entirely; use food quality language

---

## Profile 2 — Liver Metabolic Focus (NAFLD/MASLD Education)

**Profile key:** `nafld`  
**Color:** honey  
**Email funnel:** NAFLD-specific 21-day sequence

### Primary match criteria
- `goal === "liver_health"` → auto-assign
- `dx_nafld` in known conditions → strong match
- `fatty_liver` in symptoms (v1) → reclassified to Q-F01 in v2, but backward compatible
- `high_triglycerides` + `high_blood_sugar` + (`energy_crashes` or `abdominal_weight`) → moderate match

### Secondary criteria
- `goal === "belly_fat"` + `high_triglycerides` + `abdominal_weight`
- `M04: ALT or AST elevated` (Advanced)

### Exclusion rules
- `advanced_liver_disease` in safety flags → still assign NAFLD profile but with CRITICAL safety notice (advanced liver disease has different protein/sodium requirements)

### Advanced criteria
- M04: liver enzymes elevated → confirmed metabolic liver pattern
- M05: alcohol frequency → if >7/week, add note about alcohol-related vs metabolic liver health distinction
- N03: waist circumference → high visceral fat context

### Friction points
- Liver fat accumulation not visible externally
- Post-meal fatigue and brain fog
- Abdominal weight that resists standard diets
- Confusion about which fats to avoid

### Starter steps
- Remove sugar-sweetened drinks (EASL guidelines; NHS guidelines)
- Protein at every meal
- Post-meal walking

### Content hub
`/nafld`

### Pricing recommendation
`?recommended=core&profile=nafld`

### Email segment
`nafld` → NAFLD_NURTURE framework

### Safety overlays
- `advanced_liver_disease`: STRONG notice; protein requirements are fundamentally different; refer to hepatologist
- `takes_insulin`: note liver-insulin connection for T2D + NAFLD comorbidity

---

## Profile 3 — Blood Sugar Stabiliser (Prediabetes Education)

**Profile key:** `prediabetes`  
**Color:** clay  
**Email funnel:** Prediabetes-specific 21-day sequence

### Primary match criteria
- `goal === "diabetes_risk"` → auto-assign
- `dx_prediabetes` in known conditions → strong match
- `high_blood_sugar` symptom → moderate match
- O01: fasting glucose 100–125 mg/dL (Advanced)
- O02: HbA1c 5.7–6.4% (Advanced)

### Secondary criteria
- `goal === "blood_sugar"` + (`high_blood_sugar` or `energy_crashes`)
- `family_history` + `high_blood_sugar` + sedentary activity

### Exclusion rules
- `dx_t2d` → if confirmed T2D (not just prediabetes), profile becomes insulin_resistance + strong safety notice for medical supervision
- `type1_diabetes` → never assign prediabetes profile; show general_wellness with T1D safety notice

### Advanced criteria
- M06: HbA1c or fasting glucose measured → confirmed prediabetes context
- M07: doctor recommended lifestyle change → highest confidence prediabetes educational match

### Friction points
- Blood sugar that spikes and drops post-meal
- Carbohydrate reactions that differ from others'
- HbA1c/fasting glucose that has crept up
- Confusion about whether carbs are the problem

### Starter steps
- Protein anchor breakfast (Wolever et al., 1988)
- Meal sequencing — vegetables and protein before carbs (Shukla et al., 2017)
- Post-meal walking (Buffey et al., 2022)

### Evidence note
DPP: 58% reduction in T2D progression with lifestyle intervention (Knowler et al., 2002)

### Content hub
`/prediabetes`

### Pricing recommendation
`?recommended=core&profile=prediabetes`

### Email segment
`prediabetes` → PREDIABETES_NURTURE framework

---

## Profile 4 — Metabolic Syndrome Support

**Profile key:** `metabolic_syndrome`  
**Color:** forest  
**Email funnel:** Metabolic Syndrome 21-day sequence

### Primary match criteria
- `goal === "belly_fat"` → routes here (belly fat often signals metabolic syndrome)
- `dx_metabolic_syndrome` in known conditions → strong match
- ≥2 of: `high_blood_pressure` + `high_triglycerides` + `high_blood_sugar` + `dark_skin_patches` → moderate match

### Secondary criteria
- `high_blood_pressure` + `high_triglycerides` + `abdominal_weight`
- `dx_hypertension` + `dx_dyslipidemia`

### Advanced criteria
- N03: waist circumference ≥ IDF thresholds → strongest metabolic syndrome signal
- O05: triglycerides elevated
- O06: HDL low

### Friction points
- Multiple markers moving simultaneously (Grundy, 2016)
- Visceral fat that standard diets don't address
- Fatigue that makes change feel impossible
- Confusion about which condition to treat first

### Starter steps
- Protein at every meal
- Add one more vegetable at each meal
- Post-meal walking (Buffey et al., 2022)

### Evidence note
Mediterranean diet: PREDIMED trial (Estruch et al., 2013) — significant cardiovascular risk reduction

### Content hub
`/learn/metabolic-syndrome`

### Pricing recommendation
`?recommended=core&profile=metabolic_syndrome`

### Email segment
`metabolic_syndrome` → METABOLIC_SYNDROME_NURTURE framework

---

## Profile 5 — Insulin Resistance Foundation (Default)

**Profile key:** `insulin_resistance`  
**Color:** forest  
**Email funnel:** General IR 21-day sequence

### Primary match criteria
- Catch-all: does not match PCOS, NAFLD, MetSyn, or Prediabetes criteria
- `goal === "just_learning"` + general IR symptoms
- `goal === "blood_sugar"` without clear prediabetes signals
- `energy_crashes` + `cravings_sugary` + no specific diagnosis

### Secondary criteria
- `dx_ir` in known conditions → confirms this profile
- General symptom cluster without clear condition-specific pattern

### Friction points
- Energy that doesn't match effort
- Cravings that feel biological
- Weight that resists conventional approaches

### Starter steps
- Same as prediabetes — protein anchor, meal sequencing, post-meal walking

### Content hub
`/learn/what-is-insulin-resistance`

### Pricing recommendation
`?recommended=core&profile=insulin_resistance`

---

## Profile 6 — Weight-Loss Friction Pattern (NEW in v2)

**Profile key:** `weight_loss_friction`  
**Color:** clay  
**Email funnel:** Weight loss friction 21-day sequence (new, Sprint 9)

### Primary match criteria
- `goal === "weight_loss_friction"` (new goal option in v2)
- `weight_resistant` symptom + `goal === "belly_fat"` + no metabolic syndrome signals
- U01: previous weight loss attempts × multiple + U02: "hunger and cravings" as barrier

### Rationale
Many users' primary experience is difficulty losing weight despite multiple attempts. This is distinct from metabolic syndrome (which requires specific markers) and is currently poorly served by the IR default catch-all. This profile can coexist with other profiles — it's a modifier, not an exclusive assignment.

### Friction points
- Hunger that returns quickly after meals
- Cravings at specific times of day
- Previous approaches that worked initially then stopped
- Emotional or stress eating patterns
- Confusion between willpower and biology

### Evidence note
Leptin and ghrelin disruption in chronic dieters (SOURCE_REQUIRED_BEFORE_PUBLICATION — need systematic review)

### Content hub
`/obesity`

### Pricing recommendation
`?recommended=core&profile=insulin_resistance` (maps to IR profile for pricing; meal plan separate)

---

## Profile 7 — General Metabolic Wellness

**Profile key:** `general_wellness`  
**Color:** forest  
**Email funnel:** General wellness (beginner) 21-day sequence

### Primary match criteria
- `goal === "just_learning"` with no specific symptoms
- `none` selected in symptoms
- Very low symptom/condition signal overall

### Use case
Users who are genuinely just exploring metabolic health education without any specific concern. Starter Kit pricing recommendation.

### Pricing recommendation
`?recommended=starter&profile=general_wellness`

---

## Profile Priority Rules (v2)

```
v2 Priority order:
1. PCOS         (if female/intersex + PCOS signals)
2. NAFLD        (if liver signals — confirmed dx or goal=liver_health)
3. MetSyn       (if ≥2 metabolic markers)
4. Prediabetes  (if blood sugar signals)
5. IR default   (catch-all for metabolic symptoms without specific profile)
6. Weight Friction (overlay/modifier on top of profiles 3–5)
7. General Wellness (no significant signals)

v2 addition: Weight Friction can be a secondary overlay label on profiles 3–5, displayed in results as:
"Your profile also shows weight-loss friction patterns — we've included specific guidance for this."
```

---

## Comorbidity Handling (v2)

| Comorbidity | Treatment |
|-------------|-----------|
| PCOS + NAFLD | Assign NAFLD (stronger dietary urgency), add PCOS module in content |
| PCOS + Prediabetes | Assign PCOS (androgen context richer), add blood sugar module |
| MetSyn + NAFLD | Assign MetSyn (multiple markers), add NAFLD section |
| Any + T2D confirmed | Assign closest profile + CRITICAL safety notice |
| Any + advanced liver disease | Keep profile + CRITICAL safety notice (protein modification required) |

---

## Profile Confidence Score (v2)

Each profile gets a confidence level:
- **High:** goal + confirmed dx + ≥2 symptoms aligned
- **Medium:** goal OR confirmed dx, or ≥2 symptoms
- **Low:** only one weak signal

Low confidence displays: "Based on your answers, this may be your most relevant educational starting point. Complete the Advanced section for a more precise match."
