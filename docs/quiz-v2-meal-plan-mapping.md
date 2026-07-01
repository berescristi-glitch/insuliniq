# Quiz v2 Meal Plan Mapping — InsulinIQ

> Date: 2026-07-01  
> This document defines how quiz answers map to meal plan construction variables.  
> This is the data contract between the quiz engine and the future meal plan engine (Sprint 7).

---

## Framework

Every meal plan is constructed from a stack of constraints. Quiz answers populate these constraints. The meal plan engine selects recipes and structures the plan to satisfy all constraints simultaneously.

---

## Constraint 1 — Country & Region

| Answer | Effect |
|--------|--------|
| US | Recipes use cups/oz/lbs/°F. Stores: Walmart, Costco, Trader Joe's, Whole Foods, Kroger, Target, Aldi, Safeway |
| UK | Recipes use grams/ml/°C. Stores: Tesco, Sainsbury's, Asda, Aldi, Lidl, Morrisons, Waitrose, Ocado |
| AU | Recipes use grams/ml/°C. Stores: Woolworths, Coles, Aldi, IGA, local markets |
| US-subregion | Further refines store references (Pacific Northwest → Trader Joe's, Fred Meyer) |
| UK-subregion | Scotland → local suppliers; Northern Ireland → different VAT/price context |

---

## Constraint 2 — Allergens & Dietary Requirements

| Allergen | Meal plan effect |
|---------|-----------------|
| gluten | Remove all wheat, barley, rye, regular oats. Use GF oats, quinoa, rice, GF bread. Flag cross-contamination risk. |
| dairy | Remove milk, cheese, yoghurt, butter, cream. Substitute: plant-based alternatives, coconut cream, dairy-free Greek-style yoghurt. |
| eggs | Remove eggs. Substitute: tofu scramble, chia egg (baking), legume-based proteins for breakfast. |
| peanuts | Remove peanuts and peanut butter. Substitute: sunflower seed butter, almond butter (if tree_nuts not also flagged). Flag: Thai cuisine, satay, many sauces. |
| tree_nuts | Remove almonds, cashews, walnuts, pecans etc. Flag hidden sources (pesto, granola). |
| soy | Remove soy sauce, tofu, tempeh, edamame. Substitute: coconut aminos for soy sauce. |
| fish | Remove all fish. Adjust omega-3 sources to flaxseed, chia, walnuts. |
| shellfish | Remove prawns, crab, lobster, clams. Usually doesn't affect fish availability. |
| sesame | Remove tahini, hummus (if sesame-containing), sesame oil. Flag: Asian cuisine, burger buns. |
| halal | All meat must be halal-certified. Remove pork and pork products. Flag cooking utensil separation if not halal kitchen. |
| kosher | All meat must be kosher-certified. No mixing of meat and dairy in same meal. |

**Multiple allergens:** Each additional restriction narrows the recipe pool. At ≥4 allergens, consider flagging: "Your dietary needs are specific — your plan focuses on naturally compliant whole foods rather than substitute products."

---

## Constraint 3 — Diet Pattern

| Diet pattern | Meal plan effect |
|-------------|-----------------|
| no_particular | Standard metabolic health framework applies. No specific restrictions from diet choice. |
| trying_healthier | Start simple. High accessibility, quick wins first. Avoid technical language. |
| low_carb | Acknowledge current approach. Don't tell them to add carbs — frame as carb quality and pairing. Protein + vegetables emphasis. Reduce starchy carbs, increase non-starchy. |
| mediterranean | Build on existing approach. Confirm: olive oil, fish, legumes, vegetables, whole grains (not refined). Strengthen with metabolic framing. |
| vegetarian | Replace animal protein with: eggs, dairy (if not allergic), legumes, tofu, tempeh, seitan. Ensure adequate protein at 25–30g per meal — harder to achieve; requires more emphasis on legume combinations and dairy/egg protein. |
| vegan | Plant-only proteins: legumes, tofu, tempeh, seitan, edamame, hemp seeds, nutritional yeast. B12 note (requires supplementation). Iron absorption note (vitamin C with plant iron sources). Protein target harder — every meal needs combination approach. |

---

## Constraint 4 — Weekly Food Budget

| Budget tier | Meal plan effect |
|------------|-----------------|
| Low (US<$60, UK<£40, AU<A$70) | Focus on: eggs, canned legumes, frozen vegetables, whole grains (oats, rice), tinned fish (sardines, tuna), cheap cuts of meat. Avoid: salmon, specialty products, organic produce, expensive superfoods. Shopping list: value tier stores. |
| Moderate | Mix of budget staples and mid-range proteins. Frozen + fresh. Some specialty items acceptable. |
| High | Full recipe range. Fresh proteins, quality fats, organic options where beneficial. |
| Prefer not to say | Default to moderate tier |

---

## Constraint 5 — Cooking Time

| Time tier | Meal plan effect |
|-----------|-----------------|
| Under 20 min | Recipes only from "fast" category. Batch prep options. Maximise: eggs, tinned fish, pre-cooked grains, rotisserie chicken (US), ready-to-eat legumes, Greek yoghurt. Minimise: fresh vegetable prep time — use pre-cut, frozen, or microwave options. |
| 20–40 min | Standard recipe range. Most InsulinIQ recipes. |
| 40–60 min | Full recipe range including oven dishes, soups, stews. |
| Over 60 min | Complex recipes available. Batch cooking session recipes. |

---

## Constraint 6 — Cooking Skill

| Skill level | Meal plan effect |
|------------|-----------------|
| Beginner | Simple methods only: pan-fry, boil, assemble. No knife skills assumed beyond basic. Recipe instructions are step-by-step, non-technical. Avoid: roasting whole chicken, making sauces from scratch, complex spice blends. |
| Basics | Standard home cooking assumed. Can follow a recipe. Use moderate complexity. |
| Confident | Full recipe complexity. Assume timing understanding, basic knife skills, stovetop confidence. |
| Experimental | Advanced recipes permitted. Fermentation, complex spice profiles, international cuisines. |

---

## Constraint 7 — Meals Per Day (Advanced)

| Meals per day | Plan structure |
|--------------|----------------|
| 2 or fewer | Two-meal plan. Larger portions. Focus on satiety at each meal. Protein minimum 35–40g per meal. Note: low meal frequency not problematic if meals are well-structured. |
| 3 meals | Standard three-meal structure. 25–30g protein per meal. |
| 3 meals + snacks | Three meals + 1–2 planned snacks. Snacks must include protein/fat component. |
| Irregular grazing | Gentle restructuring guidance. Don't prescribe rigid timing immediately. |

---

## Constraint 8 — Protein Emphasis (by profile)

All profiles: **protein minimum 25–30g per meal** — this is universal in InsulinIQ's educational framework.

| Profile | Protein emphasis | Priority protein sources |
|---------|----------------|------------------------|
| pcos | Very high (hormonal satiety support) | Eggs, Greek yoghurt, cottage cheese, chicken, salmon, legumes |
| nafld | High (liver health, muscle mass) | Fish (especially oily), legumes, lean poultry, eggs, tofu |
| prediabetes | Very high (blood sugar anchor) | Eggs, Greek yoghurt, chicken, legumes, cottage cheese |
| metabolic_syndrome | High | Mediterranean sources: fish, legumes, poultry, dairy |
| insulin_resistance | High | Same as prediabetes |
| weight_loss_friction | Very high (satiety critical) | Highest satiety proteins: eggs, cottage cheese, Greek yoghurt, chicken breast |

**Evidence note:** Dietary protein increases satiety hormones (peptide YY, GLP-1) and reduces ghrelin (SOURCE_REQUIRED_BEFORE_PUBLICATION — need specific systematic review for protein + satiety + IR context). The 25-30g per meal threshold is based on leucine threshold for muscle protein synthesis (Witard et al., 2014 — verify specific paper).

---

## Constraint 9 — Carbohydrate Handling

InsulinIQ does NOT prescribe low-carb diets. The approach is:
- Carbohydrate quality: prefer minimally processed, high-fibre, low-GI sources
- Carbohydrate pairing: always with protein and/or fat and/or fibre
- Carbohydrate sequencing: eat vegetables and protein BEFORE carbohydrates

| Profile | Carbohydrate framing |
|---------|---------------------|
| pcos | "Paired carbs" — never carbs alone. Low-GI emphasis. |
| nafld | Reduce refined carbs and fructose (HFCS, sugary drinks). Moderate whole grain. |
| prediabetes | Portion-aware. Sequencing critical. Low-GI preference. |
| metabolic_syndrome | Mediterranean approach: whole grains, legumes, vegetables — not strict low carb. |

**For users already on low-carb:** Don't contradict. Frame as "carb quality within your approach" — e.g. "if you do include carbs, prioritise these higher-fibre options."

---

## Constraint 10 — Fibre Emphasis

All profiles: **30g+ dietary fibre per day** is the evidence-based target for metabolic health.  
(ADA, NHS, Diabetes UK guidelines — SOURCE_REQUIRED_BEFORE_PUBLICATION for specific 30g citation in IR context)

| Profile | Fibre sources to emphasise |
|---------|--------------------------|
| pcos | Legumes (chickpeas, lentils), non-starchy vegetables, berries, chia seeds |
| nafld | High-fibre vegetables, oats, psyllium, legumes |
| prediabetes | Soluble fibre priority (oats, legumes, apples) — slows glucose absorption |
| metabolic_syndrome | Mediterranean vegetables, legumes, whole grains |

---

## Constraint 11 — Vegetarian/Vegan Adaptation

When diet_pattern is vegetarian or vegan:
- Every meal: ensure protein combination (legumes + grain = complete protein)
- Replace animal protein in every recipe with plant equivalent
- B12 awareness note (vegan)
- Iron: plant sources + vitamin C pairing
- Omega-3: flaxseed, chia, walnuts (ALA) → lower bioavailability than fish EPA/DHA; note this educationally

---

## Constraint 12 — Group Size & Family Cooking

| Group | Plan structure |
|-------|----------------|
| Just myself | Single-portion recipes or clear halving instructions |
| Myself + partner | 2-portion recipes standard |
| Myself + children | Family-friendly versions. Adapt spice level. Kid-friendly protein sources. Note which elements can be prepared separately. |
| Whole family | Full family serving. Note: "This plan is naturally suitable for the whole family — no separate cooking needed." |
| Mainly eats out | Day 12 focus: restaurant and café navigation. Supermarket ready-meal swaps. |

---

## Constraint 13 — Batch Cooking

| Preference | Plan structure |
|-----------|----------------|
| Yes, regularly | Include a batch prep day (typically Sunday). Plan uses multiple meals from one preparation. e.g. "Cook double the chicken today — use half for lunch tomorrow." |
| Would like to start | Include a simple batch prep guide in Day 7 or Day 14. |
| No / Daily fresh | Individual meal recipes. No batch prep assumed. |

---

## Constraint 14 — Budget × Protein Balance

This is the most complex constraint interaction. Solving for high protein on low budget requires:

| Solution | US | UK | AU |
|----------|----|----|-----|
| Eggs | ✅ Cheap, versatile | ✅ | ✅ |
| Canned tuna | ✅ Walmart $1–2/can | ✅ Tesco 50p–£1 | ✅ Coles $1–2 |
| Canned sardines | ✅ | ✅ | ✅ |
| Lentils | ✅ | ✅ | ✅ |
| Chickpeas (canned) | ✅ | ✅ | ✅ |
| Chicken thighs | ✅ Budget-friendly | ✅ | ✅ |
| Greek yoghurt (plain) | ✅ Kirkland at Costco | ✅ Fage at Lidl/Aldi | ✅ Chobani at Coles |
| Cottage cheese | ✅ | ✅ Asda | ✅ Coles |
| Frozen edamame | ✅ Trader Joe's | ✅ Tesco | ✅ Woolworths |

---

## Constraint 15 — Safety Flags × Meal Plan

| Safety flag | Meal plan modification |
|-------------|----------------------|
| type1_diabetes / takes_insulin | Remove caloric content, remove specific carb gram counts, remove "reduce carbs" directives. Add: "Discuss any carbohydrate changes with your diabetes care team." |
| kidney_disease | Flag high-potassium foods (avocado, bananas, tomatoes, sweet potato, spinach). Flag high-phosphorus (dairy, nuts, seeds). Flag high-protein emphasis — may not be appropriate. Add renal dietitian referral note. |
| advanced_liver_disease | Protein requirement is complex (may need restriction in cirrhosis). Flag sodium-containing foods. Add hepatologist referral note. Do NOT follow standard high-protein guidance. |
| eating_disorder_history | Remove all caloric information. Remove portion sizes in grams. Remove "avoid" language. Use: "include more of", "add a portion of", "consider trying". Remove any weight-related goals from plan context. |
| pregnant | Remove caloric deficit framing entirely. Increase protein targets (to 1.1g/kg). Add: folate sources, iron sources, calcium sources. Avoid raw fish, undercooked eggs, unpasteurised dairy. |
| heart_disease | Flag saturated fat content. Emphasise: olive oil, oily fish, legumes, nuts, whole grains. Mediterranean pattern prioritised. Add: "In line with heart health guidelines — discuss with your cardiologist." |

---

## Meal Plan Output Structure (what the engine needs to produce)

For each day of a 21-day plan:
- **Breakfast:** recipe title + adapted ingredients (by country/allergen/diet) + estimated prep time + educational note
- **Lunch:** same
- **Dinner:** same
- **Optional snack:** if meals_per_day includes snacks
- **Educational anchor:** 1-sentence metabolic health context for the day's meal structure

For each week:
- **Shopping list:** grouped by store section (protein / vegetables / pantry), adapted by country and allergen
- **Weekly educational note:** evidence-informed context for the week's theme

For the whole plan:
- **Food swaps:** top 10 swaps relevant to profile and country
- **Lab values companion:** what to track and discuss with doctor
- **Eating-out guide:** restaurant navigation for profile
