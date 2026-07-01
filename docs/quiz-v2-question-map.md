# Quiz v2 Question Map — InsulinIQ

> Date: 2026-07-01  
> Format: Each question includes all metadata needed for implementation and compliance review.

---

## TIER 1 — QUICK QUIZ (~15 questions, 12 UI steps)

---

### SECTION A — Health Data Consent

---

**Q-A01**
- **section:** A — Health Data Consent
- **level:** quick
- **question:** "Before you begin: InsulinIQ will use your answers to build a personalised educational metabolic profile. Your responses are stored securely and used only for this purpose. We never sell your data."
- **input_type:** consent confirmation (checkbox + continue, or inline acknowledgement)
- **options:** "I understand — start the quiz" / "Learn how we use your data →" (links to Privacy Policy)
- **required:** YES — cannot start quiz without acknowledgement
- **why_we_ask:** GDPR/UK-GDPR Art. 13 transparency requirement; health-related quiz data is sensitive personal data under Art. 9. Consent must be informed and prior to collection.
- **used_for:** Legal basis for processing quiz data
- **affected_outputs:** None directly — gating mechanism
- **sensitivity:** special category health data gate
- **profiles_influenced:** all
- **safety_impact:** none
- **meal_plan_impact:** none
- **email_segmentation_impact:** none
- **evidence_note:** operational/legal — no scientific source needed
- **source_status:** operational/legal question, no source needed

---

### SECTION B — Main Health Goal

---

**Q-B01**
- **section:** B — Main Goal
- **level:** quick
- **question:** "What's your main health focus right now?"
- **subheading:** "Choose the one that matters most. We'll personalise your profile around it."
- **input_type:** single select
- **options:**
  - `blood_sugar` — "Understand and manage my blood sugar patterns"
  - `belly_fat` — "Reduce belly or abdominal fat"
  - `pcos` — "Support my PCOS metabolic health"
  - `liver_health` — "Learn about metabolic liver health (NAFLD/MASLD)"
  - `diabetes_risk` — "Reduce my type 2 diabetes educational risk"
  - `weight_loss_friction` — "Understand why weight loss feels difficult" *(NEW)*
  - `just_learning` — "Just want to understand my metabolic health better"
- **required:** YES
- **why_we_ask:** Primary profile routing signal. User's stated goal is the strongest single predictor of which educational content is most relevant.
- **used_for:** Profile matching (matchProfile), email funnel segment, pricing recommendation, content hub routing
- **affected_outputs:** Profile, heroTitle, results copy, nurture day 1 subject, pricing CTA
- **sensitivity:** low
- **profiles_influenced:** all
- **safety_impact:** none direct
- **meal_plan_impact:** HIGH — shapes entire plan philosophy (e.g. belly fat → caloric awareness framing; PCOS → hormonal context framing)
- **email_segmentation_impact:** HIGH — primary segment key
- **evidence_note:** User-stated goals are used in clinical research as patient-reported outcomes. Goal-directed personalisation improves engagement.
- **source_status:** operational/practical question, no source needed

---

### SECTION C — Region & Demographics

---

**Q-C01**
- **section:** C — Region
- **level:** quick
- **question:** "Where are you based?"
- **subheading:** "We use this for local store references and units of measurement."
- **input_type:** single select
- **options:** United States 🇺🇸 / United Kingdom 🇬🇧 / Australia 🇦🇺 / Other / Not listed 🌍
- **required:** YES
- **why_we_ask:** All meal plans, shopping lists, and food examples must be localised. Units differ (cups/oz vs grams/ml). Store references differ completely.
- **used_for:** Meal plan localisation, shopping list, food swaps, unit display
- **affected_outputs:** All meal plan content, shopping list, recipe ingredients
- **sensitivity:** low
- **profiles_influenced:** all (indirectly via content)
- **safety_impact:** none
- **meal_plan_impact:** CRITICAL — gates US/UK/AU content pathways
- **email_segmentation_impact:** HIGH — used for region-specific nurture variants
- **evidence_note:** operational/practical
- **source_status:** operational/practical question, no source needed

**Q-C02** *(conditional on C01 ≠ "Other")*
- **section:** C — Region
- **level:** quick
- **question:** "Which part of [Country] are you in?"
- **subheading:** "This helps us reference stores that are actually near you."
- **input_type:** single select (conditional options per country)
- **options:**
  - *US:* Northeast / Midwest / South / Southwest / West Coast / Pacific Northwest
  - *UK:* England North / England South / Scotland / Wales / Northern Ireland
  - *AU:* NSW / VIC / QLD / WA / SA / TAS / ACT / NT
- **required:** NO (optional — default to national level if skipped)
- **why_we_ask:** Store availability varies significantly within countries (e.g. Waitrose mainly England; ALDI widespread; Coles vs Woolworths coverage in AU states)
- **used_for:** Shopping list store references, food availability notes
- **affected_outputs:** Store names in shopping list
- **sensitivity:** low
- **profiles_influenced:** none (content only)
- **safety_impact:** none
- **meal_plan_impact:** MEDIUM
- **email_segmentation_impact:** LOW
- **evidence_note:** operational/practical
- **source_status:** operational/practical question, no source needed

---

### SECTION D — Age & Biological Sex

---

**Q-D01**
- **section:** D — Demographics
- **level:** quick
- **question:** "What's your age range?"
- **input_type:** single select
- **options:** Under 25 / 25–34 / 35–44 / 45–54 / 55–64 / 65+
- **required:** NO (optional — "prefer not to say" available)
- **why_we_ask:** Metabolic needs change significantly across age groups. Post-menopausal women have different insulin sensitivity patterns. Over 65 has different protein requirements.
- **used_for:** Lifestyle Friction scorer, safety context, content tone, meal plan protein targets
- **affected_outputs:** lifestyleFriction signal, personalisation note
- **sensitivity:** low
- **profiles_influenced:** all
- **safety_impact:** MEDIUM (65+ → slower progression notes, higher protein awareness)
- **meal_plan_impact:** MEDIUM (protein adequacy framing)
- **email_segmentation_impact:** LOW
- **evidence_note:** Protein requirements increase after 65 (RDA 0.8g/kg may be insufficient; Bauer et al., 2013 — JAMDA). Menopausal transition changes insulin sensitivity (Mauvais-Jarvis et al., 2011).
- **source_status:** verified (Bauer et al. 2013, Mauvais-Jarvis 2011)

**Q-D02** *(NEW — critical for PCOS routing)*
- **section:** D — Demographics
- **level:** quick
- **question:** "What is your biological sex?"
- **subheading:** "This helps personalise content about hormones, cycles, and metabolic patterns. Prefer not to say is always an option."
- **input_type:** single select
- **options:** Female / Male / Intersex / Prefer not to say
- **required:** NO (optional — "prefer not to say" skips PCOS-specific routing)
- **why_we_ask:** PCOS can only occur in people with female reproductive biology. Without this field, the matcher can assign a PCOS profile to a male user — a significant clinical error. Also: certain metabolic patterns differ significantly by sex.
- **used_for:** PCOS profile routing (if not female/intersex → exclude PCOS regardless of symptoms), safety context
- **affected_outputs:** Profile assignment (PCOS requires female/intersex/not stated), content copy
- **sensitivity:** medium (personal demographic data)
- **profiles_influenced:** pcos (blocking), all others indirectly
- **safety_impact:** HIGH — prevents impossible PCOS assignment
- **meal_plan_impact:** LOW (sex not used directly for meals)
- **email_segmentation_impact:** MEDIUM (PCOS funnel requires female/intersex flag)
- **evidence_note:** PCOS is defined by ovarian dysfunction; occurs only in individuals with ovaries. (Teede et al., 2023)
- **source_status:** verified (Teede et al. 2023 PCOS Guidelines)

---

### SECTION E — Safety Screening

---

**Q-E01**
- **section:** E — Safety Screening
- **level:** quick
- **question:** "A few quick health questions — so we can personalise the safety notices on your results."
- **subheading:** "Select all that apply. If none apply, you can continue. These help us know when to recommend extra care before any dietary change."
- **input_type:** multi-select with "None of the above" option
- **options:**
  - `type1_diabetes` — "I have type 1 diabetes"
  - `takes_insulin` — "I take insulin (any type)"
  - `hypoglycemia_risk_medication` — "I take medication that can cause low blood sugar (e.g. sulfonylureas, glinides)"
  - `pregnant` — "I am currently pregnant"
  - `breastfeeding` — "I am currently breastfeeding"
  - `kidney_disease` — "I have kidney disease or am on dialysis"
  - `advanced_liver_disease` — "I have advanced liver disease or cirrhosis"
  - `eating_disorder_history` — "I have a history of eating disorders"
  - `under_18` — "I am under 18 years old"
  - `heart_disease` — "I have heart disease or have had a heart attack/stroke" *(NEW)*
  - `thyroid_condition` — "I have a thyroid condition (hypothyroid/hyperthyroid)" *(NEW)*
  - `active_cancer_treatment` — "I am currently undergoing cancer treatment" *(NEW)*
  - `none` — "None of these apply to me"
- **required:** NO (skippable with "I'd rather not say" — reduces barrier)
- **why_we_ask:** CLAUDE.md §16 compliance. These flags generate SafetyNotice on results page and modify email copy. Never used to block quiz access.
- **used_for:** SafetyNotice generation, email safety segmentation, has_safety_flags flag in DB, educational copy adjustment
- **affected_outputs:** SafetyNotice component, email nurture copy modifiers
- **sensitivity:** special category health data (GDPR Art. 9)
- **profiles_influenced:** all (safety modifier, not profile changer)
- **safety_impact:** CRITICAL
- **meal_plan_impact:** HIGH (some flags completely change meal composition advice)
- **email_segmentation_impact:** HIGH (has_safety_flags gates aggressive restriction copy)
- **evidence_note:** Safety screening is standard practice in RCT dietary intervention protocols (see ADA Standards of Care, 2024)
- **source_status:** verified (ADA Standards of Care 2024)

---

### SECTION F — Known Conditions

---

**Q-F01** *(NEW — replaces "fatty_liver" as a symptom)*
- **section:** F — Known Conditions
- **level:** quick
- **question:** "Have you been told by a healthcare provider that you have any of the following?"
- **subheading:** "Select all that apply. 'I don't know' or 'I haven't been tested' are valid answers."
- **input_type:** multi-select
- **options:**
  - `dx_ir` — "Insulin resistance"
  - `dx_prediabetes` — "Prediabetes or impaired fasting glucose"
  - `dx_t2d` — "Type 2 diabetes"
  - `dx_pcos` — "Polycystic ovary syndrome (PCOS)"
  - `dx_nafld` — "Fatty liver disease / NAFLD / MASLD"
  - `dx_metabolic_syndrome` — "Metabolic syndrome"
  - `dx_hypothyroid` — "Underactive thyroid (hypothyroidism)"
  - `dx_hypertension` — "High blood pressure (hypertension)"
  - `dx_dyslipidemia` — "High cholesterol or high triglycerides"
  - `dx_sleep_apnea` — "Sleep apnoea"
  - `none_of_above` — "None of these have been diagnosed"
  - `not_tested` — "I haven't had relevant testing / I don't know"
- **required:** NO (optional, with "prefer not to say" exit)
- **why_we_ask:** Confirmed diagnosis vs suspected condition changes the educational tone significantly. A confirmed NAFLD user needs different content than someone who suspects it.
- **used_for:** Profile confidence scoring, matcher priority boosting, copy tone ("you mentioned you've been told..." vs "your answers suggest...")
- **affected_outputs:** Profile heroTitle tone, whatItMeans content, safety notices
- **sensitivity:** special category health data
- **profiles_influenced:** all (boosts confidence; confirmed dx → higher priority match)
- **safety_impact:** HIGH (confirmed T2D → stronger safety notice)
- **meal_plan_impact:** MEDIUM
- **email_segmentation_impact:** HIGH (confirmed vs suspected changes nurture tone)
- **evidence_note:** Patient-reported confirmed diagnoses are clinically valid for risk stratification in lifestyle interventions (DPP methodology)
- **source_status:** verified (Knowler et al. 2002 — DPP methodology includes self-reported diagnoses)

---

### SECTION G — Symptoms & Daily Signals

---

**Q-G01** *(expanded from current Step 3)*
- **section:** G — Symptoms
- **level:** quick
- **question:** "Which of these have you noticed in the past few months?"
- **subheading:** "Select all that apply. These help us personalise which educational signals are most relevant. They are not a diagnosis."
- **input_type:** multi-select
- **options:**
  - `energy_crashes` — "Energy crashes in the afternoon or after meals"
  - `cravings_sugary` — "Cravings for sweet or starchy foods — especially in the afternoon" *(renamed/clarified)*
  - `weight_resistant` — "Difficulty losing weight even when trying" *(NEW)*
  - `high_blood_sugar` — "Been told my blood sugar is higher than normal"
  - `high_blood_pressure` — "Been told my blood pressure is higher than normal"
  - `high_triglycerides` — "Been told my triglycerides are higher than normal"
  - `irregular_periods` — "Irregular, infrequent, or missed periods"
  - `acne_or_hair_growth` — "Acne or unwanted hair growth (face/body)"
  - `dark_skin_patches` — "Darker patches of skin around neck, armpits, or groin"
  - `post_meal_fatigue` — "Feeling very tired or foggy after eating" *(NEW)*
  - `frequent_hunger` — "Feeling hungry again within 2 hours of eating" *(NEW)*
  - `sleep_issues` — "Poor sleep quality or difficulty staying asleep" *(NEW)*
  - `abdominal_weight` — "Most of my extra weight is around my belly/abdomen" *(NEW)*
  - `skin_tags` — "Skin tags (small soft growths on neck, armpits, groin)" *(NEW)*
  - `family_history` — "Close family member with diabetes, PCOS, or heart disease"
  - `none` — "None of these currently apply to me"
- **required:** NO (must select at least 1 including "none" to advance, same as current)
- **why_we_ask:** Symptoms are the secondary profile signal after goal. Expanded list improves differentiation between IR, MetSyn, and prediabetes.
- **used_for:** Profile matching, scorer signals, friction points generation, personalisation note
- **affected_outputs:** Profile, frictionPoints, scorer signals, personalizationNote
- **sensitivity:** medium-high (health-adjacent symptoms)
- **profiles_influenced:** all
- **safety_impact:** MEDIUM
- **meal_plan_impact:** HIGH (energy crashes → breakfast focus; cravings → meal sequencing; abdominal weight → deficit framing)
- **email_segmentation_impact:** HIGH (symptoms drive Day 3–6 email topics)
- **evidence_note:** Acanthosis nigricans (dark_skin_patches) is associated with insulin resistance with moderate sensitivity (Brickman et al., 2010). Skin tags have weaker but documented association (Rasi et al., 2007). Energy crashes post-meal associated with reactive hypoglycemia in IR context.
- **source_status:** verified (Brickman 2010, Rasi 2007); SOURCE_REQUIRED_BEFORE_PUBLICATION for skin_tags in metabolic syndrome context specifically

---

### SECTION H — Current Eating Pattern

---

**Q-H01** *(unchanged from current Step 4)*
- **section:** H — Eating Pattern
- **level:** quick
- **question:** "How would you describe your current diet?"
- **subheading:** "No judgement — this helps us meet you where you are."
- **input_type:** single select
- **options:**
  - `no_particular` — "No particular diet / I eat whatever's available"
  - `trying_healthier` — "I'm trying to eat healthier but finding it hard"
  - `low_carb` — "I follow a low-carb or keto approach"
  - `mediterranean` — "I eat a Mediterranean-style diet"
  - `vegetarian` — "I'm vegetarian"
  - `vegan` — "I'm vegan"
- **required:** YES (single select, clear options)
- **why_we_ask:** Shapes meal plan tone and content. A current keto follower doesn't need "try cutting carbs" advice. A vegan needs plant-based protein focus.
- **used_for:** Meal plan foundation, lifestyleFriction scorer (no_particular → higher friction), email day 4 topic
- **affected_outputs:** Meal plan protein sources, food swap examples, lifestyleFriction scorer
- **sensitivity:** low
- **profiles_influenced:** all (indirectly via meal plan)
- **safety_impact:** none
- **meal_plan_impact:** CRITICAL for recipe selection
- **email_segmentation_impact:** MEDIUM (vegetarian/vegan → different recipe emails)
- **evidence_note:** Diet pattern is used as a clinical covariate in metabolic intervention studies (Esposito et al. 2004)
- **source_status:** operational/practical question, no source needed

---

### SECTION I — Food Restrictions & Allergens

---

**Q-I01** *(unchanged from current Step 5)*
- **section:** I — Restrictions
- **level:** quick
- **question:** "Any allergies, intolerances, or dietary requirements?"
- **subheading:** "We filter every recipe and meal example for these."
- **input_type:** multi-select (with "None" option)
- **options:** Gluten-free / Dairy-free / Egg-free / Peanut-free / Tree nut-free / Soy-free / Fish-free / Shellfish-free / Sesame-free / Halal / Kosher / None of the above
- **required:** NO (always advanceable)
- **why_we_ask:** Allergen safety and dietary compliance. A gluten-free user who receives a wheat-based recipe will abandon the plan immediately.
- **used_for:** Recipe filtering, shopping list, meal plan, lifestyleFriction scorer
- **affected_outputs:** All recipe content, shopping list, personalisationNote
- **sensitivity:** medium (health-adjacent)
- **profiles_influenced:** all (content filter)
- **safety_impact:** MEDIUM (anaphylaxis risk if ignored)
- **meal_plan_impact:** CRITICAL
- **email_segmentation_impact:** MEDIUM
- **evidence_note:** operational/practical
- **source_status:** operational/practical question, no source needed

---

### SECTION J — Cooking Reality

---

**Q-J01** *(unchanged, but consider splitting in Advanced tier)*
- **section:** J — Cooking
- **level:** quick
- **question:** "How much time do you realistically have to cook on a typical weekday?"
- **input_type:** single select
- **options:** Under 20 minutes / 20–40 minutes / 40–60 minutes / Over 60 minutes
- **required:** YES
- **why_we_ask:** Meals that take longer than the user can realistically prepare will be abandoned. This is one of the most predictive plan adherence variables.
- **used_for:** Recipe complexity filter, lifestyleFriction scorer, meal plan pacing
- **affected_outputs:** Recipe selection, day-by-day plan structure
- **sensitivity:** low
- **profiles_influenced:** all (content filter)
- **safety_impact:** none
- **meal_plan_impact:** CRITICAL
- **email_segmentation_impact:** LOW
- **evidence_note:** Time constraint is a primary barrier to dietary change in behaviour change literature (Hingle & Kunkel, 2012 — SOURCE_REQUIRED_BEFORE_PUBLICATION — verify specific paper)
- **source_status:** SOURCE_REQUIRED_BEFORE_PUBLICATION

**Q-J02**
- **section:** J — Cooking
- **level:** quick
- **question:** "How would you describe your cooking skill level?"
- **input_type:** single select
- **options:** Complete beginner (I mostly use ready meals) / I can manage the basics / I'm confident in the kitchen / I enjoy experimenting
- **required:** NO
- **why_we_ask:** Recipe complexity should match skill level. A beginner who receives a complex recipe will feel overwhelmed and abandon the plan.
- **used_for:** Recipe complexity filter, lifestyleFriction scorer
- **affected_outputs:** Recipe difficulty filter
- **sensitivity:** low
- **profiles_influenced:** all
- **safety_impact:** none
- **meal_plan_impact:** HIGH
- **email_segmentation_impact:** LOW
- **evidence_note:** operational/practical
- **source_status:** operational/practical question, no source needed

---

### SECTION K — Weekly Food Budget

---

**Q-K01** *(NEW — critical for meal plan adaptation)*
- **section:** K — Budget
- **level:** quick
- **question:** "What's your approximate weekly food budget for one person?"
- **input_type:** single select (per-country conditional)
- **options:**
  - *US:* Under $60/week / $60–100 / $100–150 / Over $150 / Prefer not to say
  - *UK:* Under £40/week / £40–70 / £70–100 / Over £100 / Prefer not to say
  - *AU:* Under A$70/week / A$70–120 / A$120–180 / Over A$180 / Prefer not to say
  - *Other:* Low budget / Moderate budget / No particular constraint / Prefer not to say
- **required:** NO (always optional, "prefer not to say" always available)
- **why_we_ask:** Budget is one of the most commonly reported barriers to healthy eating. Protein-rich, fresh food can be expensive. Without budget context, the plan may recommend foods the user can't afford.
- **used_for:** Shopping list tier (budget-friendly vs premium options), store selection, protein source prioritisation (legumes vs salmon)
- **affected_outputs:** Shopping list, recipe protein sources, food swap tier
- **sensitivity:** medium (economic data)
- **profiles_influenced:** all (content filter)
- **safety_impact:** none
- **meal_plan_impact:** HIGH
- **email_segmentation_impact:** LOW
- **evidence_note:** Cost is the most frequently cited barrier to dietary improvement (Monsivais et al., 2010 — SOURCE_REQUIRED_BEFORE_PUBLICATION — verify specific paper)
- **source_status:** SOURCE_REQUIRED_BEFORE_PUBLICATION

---

### SECTION L — Email + Marketing Consent

---

**Q-L01** *(existing Step 9 — no changes needed)*
- **section:** L — Email Gate
- **level:** quick
- **question:** "Enter your email to save your results and access your educational plan."
- **input_type:** email field + marketing consent checkbox
- **required:** NO (skip path available)
- **marketing_consent_copy:** "I'd like to receive educational emails from InsulinIQ about metabolic health, nutrition habits, and future product updates. I can unsubscribe at any time."
- **microcopy:** "Your quiz result is shown regardless of this choice. Marketing emails are optional and separate from your quiz results."
- **source_status:** legal/operational

---

## TIER 2 — ADVANCED PERSONALIZATION (~40–50 additional questions)

> Presented AFTER Quick Quiz results page, via optional CTA: "Get a more personalised plan — takes ~10 more minutes."

---

### SECTION M — Condition Deep Dive (branched)

Shown only if corresponding flag is set in F01 or matching symptoms in G01.

**Q-M01** *(PCOS branch — shown if pcos profile)*
- **question:** "How long ago were you diagnosed with PCOS, or when did you first notice these patterns?"
- **input_type:** single select: Less than 1 year ago / 1–3 years / 3–10 years / Over 10 years / I haven't been formally diagnosed
- **why_we_ask:** Duration influences how embedded the patterns are and the educational framing needed.
- **sensitivity:** high

**Q-M02** *(PCOS branch)*
- **question:** "How regular is your menstrual cycle?"
- **input_type:** single select: Regular (28–35 days) / Irregular (varies widely) / Very infrequent (fewer than 8 cycles/year) / Absent / I use hormonal contraception (cycle masked) / Not applicable / Prefer not to say
- **why_we_ask:** Cycle regularity is the primary clinical diagnostic criterion for PCOS; educational context needs this.
- **sensitivity:** special category

**Q-M03** *(PCOS branch)*
- **question:** "Have any of these been measured and found elevated or abnormal? (Select all that apply)"
- **input_type:** multi-select: Free testosterone / Total testosterone / DHEA-S / LH:FSH ratio / Anti-Müllerian hormone (AMH) / None measured / I don't know
- **why_we_ask:** Androgen markers differentiate metabolic from non-metabolic PCOS subtypes.
- **sensitivity:** special category

**Q-M04** *(NAFLD branch — shown if nafld profile)*
- **question:** "Have any of these liver tests come back abnormal? (Select all that apply)"
- **input_type:** multi-select: ALT (elevated) / AST (elevated) / GGT (elevated) / Liver ultrasound (showing fat) / Liver biopsy / None tested / I don't know
- **sensitivity:** special category

**Q-M05** *(NAFLD branch)*
- **question:** "How often do you drink alcohol?"
- **input_type:** single select: Never / 1–2 drinks per week / 3–7 drinks per week / More than 7 per week / Prefer not to say
- **why_we_ask:** Alcohol is a direct liver fat driver; differentiates alcoholic from metabolic liver disease.
- **sensitivity:** medium-high

**Q-M06** *(Prediabetes branch)*
- **question:** "Have you had any of these measured recently? (Select all that apply — tick 'I don't know' if unsure)"
- **input_type:** multi-select with values: HbA1c measured / Fasting glucose measured / Fasting insulin measured / HOMA-IR calculated / None measured / I don't know
- **sensitivity:** special category

**Q-M07** *(Prediabetes branch)*
- **question:** "Has a healthcare provider suggested you make lifestyle changes to reduce your diabetes risk?"
- **input_type:** single select: Yes, recently / Yes, but some time ago / No / I don't know
- **sensitivity:** medium

---

### SECTION N — Anthropometrics (all optional)

**Q-N01**
- **question:** "What is your height? (optional)"
- **input_type:** dual numeric (ft/in or cm, based on region)
- **required:** NO, explicit "prefer not to say"
- **why_we_ask:** Used to contextualise weight and waist circumference. Not used for BMI display (BMI has limitations as a metabolic marker).
- **sensitivity:** medium
- **evidence_note:** Height alone has limited metabolic significance; used as denominator for body composition context.

**Q-N02**
- **question:** "What is your current weight? (optional)"
- **input_type:** numeric (lbs or kg, based on region)
- **required:** NO, "prefer not to say"
- **sensitivity:** medium-high (body weight is sensitive)
- **meal_plan_impact:** MEDIUM (caloric context, protein target)
- **safety note:** Display must NOT calculate or display BMI as a health status indicator. Never show "overweight", "obese" classifications.

**Q-N03**
- **question:** "What is your waist circumference? (optional)"
- **subheading:** "Measured at the level of your belly button, relaxed. This is more metabolically relevant than weight alone."
- **input_type:** numeric (inches or cm)
- **required:** NO
- **why_we_ask:** Waist circumference is the most clinically validated proxy for visceral fat and metabolic syndrome risk. More useful than BMI for metabolic profiling.
- **sensitivity:** medium
- **evidence_note:** Waist circumference ≥94cm (men) or ≥80cm (women) in European-background populations is a metabolic syndrome criterion (IDF Consensus 2006). Different thresholds apply for Asian populations.
- **source_status:** verified (IDF 2006 Metabolic Syndrome Definition)

---

### SECTION O — Optional Lab Values

**Q-O01** through **Q-O08**
*All optional, all presented with "I don't know / haven't tested" as default*

| ID | Marker | Why collected |
|----|--------|---------------|
| Q-O01 | Fasting glucose (mg/dL or mmol/L) | Blood sugar stability signal |
| Q-O02 | HbA1c (%) | Longer-term blood sugar picture |
| Q-O03 | Fasting insulin (µIU/mL or pmol/L) | Direct IR marker |
| Q-O04 | HOMA-IR (if calculated) | IR index |
| Q-O05 | Fasting triglycerides (mg/dL or mmol/L) | MetSyn signal |
| Q-O06 | HDL cholesterol (mg/dL or mmol/L) | MetSyn signal |
| Q-O07 | ALT (U/L) | Liver health signal |
| Q-O08 | TSH (mIU/L) | Thyroid context |

**Compliance note:** Lab values are displayed back to users with clear non-diagnostic framing: "You mentioned your [marker] was [value]. Our educational content discusses what this range is commonly associated with — always discuss your specific values with your healthcare provider."

**Never display:** "Your HbA1c of X puts you in the [category] range" without the full disclaimer.

---

### SECTION P — Eating Behavior

**Q-P01**
- **question:** "On a typical day, how many times do you eat (including snacks)?"
- **input_type:** single select: 2 or fewer / 3 meals / 3 meals + 1–2 snacks / I graze throughout the day / Very irregular — no fixed pattern
- **why_we_ask:** Meal frequency shapes the meal plan structure (number of recipes per day, snack slots).
- **sensitivity:** low

**Q-P02**
- **question:** "When during the day do cravings or hunger feel hardest to manage?"
- **input_type:** multi-select: Morning / Mid-morning / After lunch / Mid-afternoon / Evening / Late night / Cravings aren't a major issue for me
- **why_we_ask:** Timing of cravings helps identify whether the pattern is reactive (post-meal glucose drop) or behavioral. Shapes Day 4 email and friction points.
- **sensitivity:** low

**Q-P03**
- **question:** "How quickly do you typically eat your main meals?"
- **input_type:** single select: Very quickly (5–10 min) / Moderately fast (10–20 min) / Slowly (20–30 min) / Very slowly (30+ min)
- **why_we_ask:** Eating speed is associated with satiety signal timing and post-meal glucose response.
- **evidence_note:** Fast eating is associated with higher BMI and glucose dysregulation (Zhu et al., 2015 — SOURCE_REQUIRED_BEFORE_PUBLICATION — verify journal)
- **sensitivity:** low

**Q-P04**
- **question:** "At what time do you typically have your first meal of the day?"
- **input_type:** single select: Before 7am / 7–9am / 9am–12pm / After noon / I skip breakfast most days
- **why_we_ask:** Breakfast timing is relevant to circadian biology and the "second meal effect" framework used in educational content.
- **sensitivity:** low

---

### SECTION Q — Sleep & Stress

**Q-Q01**
- **question:** "On most nights, how many hours of sleep do you get?"
- **input_type:** single select: Less than 5 hours / 5–6 hours / 7–8 hours / More than 9 hours / Very variable
- **why_we_ask:** Sleep is now considered a primary metabolic variable. A single night of 5-hour sleep reduces insulin sensitivity by ~25% (Donga et al., 2010).
- **sensitivity:** low
- **evidence_note:** verified (Donga et al. 2010)

**Q-Q02**
- **question:** "How would you rate your current stress level on most days?"
- **input_type:** single select: Low (rarely feel overwhelmed) / Moderate (regular but manageable) / High (frequently stressed) / Very high (chronically overwhelmed)
- **why_we_ask:** Chronic cortisol elevation directly impairs insulin signalling and raises fasting glucose (Hackett & Steptoe, 2017).
- **sensitivity:** medium
- **evidence_note:** verified (Hackett & Steptoe 2017)

---

### SECTION R — Physical Activity

**Q-R01**
- **question:** "How active are you on a typical week?"
- **input_type:** single select: Mostly sedentary (desk work, minimal movement) / Lightly active (some walking, light activity) / Moderately active (30+ min exercise 3x/week) / Very active (daily exercise or physical job)
- **why_we_ask:** Activity level is a primary modifier of insulin sensitivity and sets the caloric and protein context for meal plans.
- **sensitivity:** low
- **evidence_note:** Physical activity improves insulin sensitivity independent of weight loss (Strasser & Schobersberger, 2011)

**Q-R02**
- **question:** "What type of movement do you currently do? (Select all that apply)"
- **input_type:** multi-select: Walking / Running / Cycling / Resistance/weight training / Yoga or stretching / Swimming / Team sports / Minimal planned exercise / Other
- **why_we_ask:** Type of exercise shapes the meal plan framing (resistance training → protein emphasis; endurance → carbohydrate context)
- **sensitivity:** low

---

### SECTION S — Practical Meal Planning

**Q-S01**
- **question:** "Do you cook for just yourself, or for others too?"
- **input_type:** single select: Just myself / Myself + partner / Myself + children / Whole family (mixed ages) / I mainly eat out or buy ready meals
- **why_we_ask:** Recipe portion sizes, complexity, and kid-friendly options vary dramatically based on this answer.
- **sensitivity:** low
- **meal_plan_impact:** CRITICAL

**Q-S02**
- **question:** "How often do you eat away from home (restaurants, cafes, takeaways)?"
- **input_type:** single select: Rarely (less than once a week) / 1–3 times a week / 4–6 times a week / Most meals are eaten out
- **why_we_ask:** Shapes the eating-out guide content and how much the plan focuses on home-cooked vs on-the-go options.
- **sensitivity:** low

**Q-S03**
- **question:** "Do you do batch cooking or meal prep?"
- **input_type:** single select: Yes, regularly / Sometimes / Rarely / No, I prefer fresh daily / I'd like to but haven't started
- **why_we_ask:** Batch cookers can receive a different plan structure (prep day + reheat days). First-time preppers need simpler guidance.
- **sensitivity:** low

**Q-S04**
- **question:** "Which meal is the most challenging to keep healthy?"
- **input_type:** single select: Breakfast / Lunch (especially at work) / Dinner / Snacks / All are challenging
- **why_we_ask:** Shapes which part of the day the plan focuses most effort on.
- **sensitivity:** low

---

### SECTION T — Food Preferences

**Q-T01**
- **question:** "Are there any foods you strongly dislike or refuse to eat? (optional free text)"
- **input_type:** short text (optional, max 200 chars)
- **why_we_ask:** Including disliked foods in a plan leads to abandonment. This is the single most common complaint about generic meal plans.
- **sensitivity:** low
- **meal_plan_impact:** HIGH (disliked foods excluded from plan)

**Q-T02**
- **question:** "Do you have any cultural or religious food preferences beyond what you've mentioned? (optional)"
- **input_type:** multi-select: Halal / Kosher / Hindu vegetarian / Jain / No pork / No beef / Ramadan-aware (fasting period) / None / Prefer not to say
- **why_we_ask:** Standard halal/kosher covered in allergens; this question catches finer cultural preferences that affect recipe selection beyond the binary.
- **sensitivity:** medium (religious/cultural data)

**Q-T03**
- **question:** "Which of these types of food do you enjoy or eat regularly? (Select all that apply)"
- **input_type:** multi-select: Eggs / Dairy (yoghurt, cheese) / Fish / Red meat / Chicken/poultry / Legumes (beans, lentils) / Tofu/tempeh / Nuts and seeds / Rice and grains / Pasta / Bread / Root vegetables / None / Other
- **why_we_ask:** Positive preferences are as important as restrictions. Building a plan around liked foods dramatically improves adherence.
- **sensitivity:** low

---

### SECTION U — Previous Approaches

**Q-U01**
- **question:** "Have you tried any of these approaches before? (Select all that apply)"
- **input_type:** multi-select: Calorie counting / Low carb or keto / Intermittent fasting / Weight loss programs (e.g. Weight Watchers, Slimming World) / Very low calorie diet / Mediterranean diet / No structured approach / Other
- **why_we_ask:** Previous experience shapes what advice will feel redundant vs novel. Avoids recommending approaches that have already failed.
- **sensitivity:** low

**Q-U02**
- **question:** "When you've tried to change your eating before, what got in the way? (Select all that apply)"
- **input_type:** multi-select: Hunger and cravings / Stress or emotions / Social situations / Time and convenience / Cost / Lack of results / Boredom with the food / Didn't know where to start / Nothing — I haven't tried before / Other
- **why_we_ask:** Barrier identification shapes the email funnel framing. A user who lists "cravings" as a barrier needs Day 3 email to address cravings specifically.
- **sensitivity:** low-medium
- **email_segmentation_impact:** HIGH (barriers → friction email topics)

---

### SECTION V — Readiness & Motivation

**Q-V01**
- **question:** "How ready do you feel to make changes to your eating right now?"
- **input_type:** single select: Very ready — I've already started / Ready — I want to make changes this week / Thinking about it — not quite ready / Just exploring — not ready to change yet
- **why_we_ask:** Readiness stage (Transtheoretical Model) dramatically changes which educational framing is appropriate. A "just exploring" user needs different content than someone who "already started."
- **sensitivity:** low
- **evidence_note:** Prochaska & DiClemente (1983) Transtheoretical Model — stages of change. Applied in dietary behaviour research.
- **source_status:** verified (Prochaska & DiClemente 1983)

---

### SECTION W — Output Preferences

**Q-W01**
- **question:** "How would you prefer to receive your plan?"
- **input_type:** multi-select: Detailed written guides / Simple visual tables / Short daily emails / Weekly summary / Quick action lists / App (future)
- **why_we_ask:** Format preference shapes content delivery. Shapes email template complexity and results page emphasis.
- **sensitivity:** low

---

## Question Count Summary

| Tier | Section | Questions | Required |
|------|---------|-----------|---------|
| Quick | A–L | 15 | 4 |
| Advanced | M–W | ~42 | 0 |
| **Total** | | **~57** | **4** |

**Quick required fields:** Goal, Country, Safety (can answer "none"), Email or Skip  
**Everything else:** Optional with "prefer not to say" / "I don't know" always available
