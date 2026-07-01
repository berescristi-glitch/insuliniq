# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

It has two parts:
- **Part 1 (English)** — product vision, business strategy, content pillars, quiz design, monetisation model, medical/compliance rules. This is the strategic source of truth for *why* the project exists and *where it's going*.
- **Part 2 (Romanian)** — technical implementation guide derived from the actual codebase (stack, routes, code patterns). This is the source of truth for *how to write code here*.

When the two disagree on an implementation detail (e.g. payment provider, quiz length, email funnel length), **Part 2 reflects what's actually built and wins** — Part 1 is updated incrementally as build phases complete, but the live code is always the final authority.

---

# §0 — EVIDENCE-FIRST CONTENT RULES (MANDATORY — overrides all other instructions)

**These rules apply to every piece of text produced for InsulinIQ:** articles, quiz results, profile descriptions, emails, CTAs, recipes, meal plans, FAQ, AI assistant, and any marketing copy. They override copywriting, conversion, and design goals. Do not sacrifice scientific accuracy for conversion rate.

## §0.1 — Never Invent Information
If a claim cannot be supported by peer-reviewed studies, clinical guidelines, systematic reviews, or meta-analyses, do not include it. No invented citations, no invented DOIs, no invented author names.

## §0.2 — Forbidden Claim Patterns
Never use language that implies cure, reversal, or guaranteed outcome:
- ❌ "reverses insulin resistance", "cures fatty liver", "treats PCOS", "eliminates cravings", "normalises hormones", "guarantees weight loss", "heals the liver", "stops prediabetes"

Always use cautious, accurate language:
- ✅ "may support", "is associated with", "studies suggest", "may help improve", "may contribute to", "discuss with your doctor before making major changes"

## §0.3 — Every Major Claim Needs a Source
Claims about insulin, blood sugar, insulin resistance, PCOS, NAFLD/MASLD, prediabetes, T2DM, obesity, fibre, protein, carbohydrates, vinegar, post-meal movement, food order, protein breakfast, fasting, microbiome, fermented dairy, legumes, weight loss, or satiety must have a credible source attached.

## §0.4 — Evidence Levels (use internally for every claim)
- **Strong**: guidelines, meta-analyses, systematic reviews, consistent RCTs
- **Moderate**: smaller RCTs, solid observational studies, partial scientific consensus
- **Emerging**: promising but insufficient evidence
- **Mixed**: contradictory results — frame accordingly
- **Insufficient**: do not use the claim as a recommendation

## §0.5 — Do Not Convert Study Observations into Promises
If a study shows an association or a possible improvement, do not frame it as a guaranteed outcome for the user.
- ❌ "Walking after meals lowers your blood sugar."
- ✅ "Studies suggest that light movement after eating may reduce postprandial glucose spikes in some people."

## §0.6 — Separate Education from Medical Advice
Every section that influences behaviour must maintain an educational tone:
- Do not diagnose
- Do not treat
- Do not interpret individual lab results
- Do not adjust medication
- Do not tell the user what they "must" do medically
- Recommend speaking with a doctor in relevant cases

## §0.7 — Quiz Results Page — Safe Phrasing Only
- ✅ "Based on your answers, this profile may suggest a pattern commonly discussed in metabolic health education."
- ✅ "This is not a diagnosis or a clinical risk score."
- ✅ "Your answers can help guide which educational resources may be most relevant."
- ✅ "If you have symptoms, a diagnosis, or take medication, discuss dietary changes with your healthcare provider."

## §0.8 — Meal Plans — Justify Principles, Never Promise Outcomes
Plans may explain *why* they include protein at every meal, fibre, low-GI carbs, legumes, or post-meal movement. They must never promise: guaranteed weight loss, normalisation of labs, reversal of insulin resistance, cure of PCOS, cure of fatty liver, or medication reduction.

## §0.9 — Insufficient Evidence is Acceptable to State
It is correct and recommended to write: "Evidence is limited.", "Evidence is mixed.", "This is a practical strategy, not a proven treatment.", "More research is needed.", "This should not replace medical care."

## §0.10 — Evidence & Claims Audit (required after each content task)
After completing any content implementation, provide a section:

**EVIDENCE & CLAIMS AUDIT**
- List of major claims introduced
- Evidence level for each
- Recommended source
- Whether source needs manual verification
- Any claims removed for being too strong
- Any remaining legal/compliance risk

---

# PART 1 — Product Vision & Business Strategy

## 1. Project Identity

Project name: **InsulinIQ**

Positioning: **InsulinIQ is an evidence-based metabolic education platform focused on insulin resistance and its connection with fatty liver disease, obesity, PCOS, metabolic syndrome, prediabetes, cravings, appetite control, blood sugar regulation and nutrition.**

The platform helps users understand how insulin resistance works and how nutrition, lifestyle habits, weight loss, meal structure, food quality, fibre, protein, movement and sustainable routines can support better metabolic health.

The project must **not** present itself as a medical treatment platform. It is positioned as an **educational, evidence-based nutrition and metabolic health platform**.

Core brand idea: **From scientific evidence to everyday meals.**

Alternative brand message: **Learn how insulin, blood sugar and metabolism work — then apply that knowledge to your plate.**

## 2. Main Goal of the Project

The central topic is **insulin resistance**, approached as a common metabolic mechanism behind multiple related conditions:

- fatty liver disease / NAFLD / MASLD
- obesity, especially abdominal obesity
- polycystic ovary syndrome / PCOS
- metabolic syndrome
- prediabetes and type 2 diabetes risk
- cravings and frequent hunger
- difficulty losing weight
- poor metabolic flexibility
- blood sugar instability

The platform educates users through free content and then guides them toward a paid nutrition plan adapted to their profile, country, food preferences, allergies, restrictions and metabolic context.

Business logic:

**Education → Quiz → User Profile → Personalized Direction → Free Guide → Paid Meal Plan → Ongoing Content / Membership**

## 3. Target Markets

Three English-speaking markets only: **United States, United Kingdom / England, Australia.**

All meal plans, recipes, shopping lists, food examples, units of measurement and terminology must be adapted to these three markets.

### United States
Units/terms: fiber, cups, ounces, pounds, Fahrenheit if needed. American grocery examples, American-style meals, meal prep language.
Stores: Walmart, Costco, Trader Joe's, Whole Foods, Kroger, Target, Aldi, Safeway.
Meal examples: egg bites with cottage cheese and spinach; chicken burrito bowls; turkey lettuce wraps; Greek yogurt protein bowls; turkey chili; rotisserie chicken salad; beef taco bowls; sheet-pan chicken and vegetables.

### United Kingdom / England
Units/terms: fibre, grams, millilitres, kilograms, Celsius. UK supermarket examples, NHS-friendly tone, simple British-style meals, lunchbox and batch cooking language.
Stores: Tesco, Sainsbury's, Asda, Aldi, Lidl, Morrisons, Waitrose, Ocado, Iceland.
Meal examples: savoury eggs with mushrooms and tomatoes; Greek yoghurt with chia and berries; chicken salad lunch box; turkey mince chilli; lentil soup with boiled eggs; jacket potato with cottage cheese and salad; chicken traybake; omelette with spinach; beef mince bowl.

### Australia
Units/terms: fibre, grams, millilitres, kilograms, Celsius. Australian grocery examples, fresh meals, salads, BBQ-style meals, lunch bowls.
Stores: Woolworths, Coles, Aldi, IGA, local markets.
Meal examples: eggs with avocado and spinach; chicken and quinoa salad; beef mince lettuce bowl; Greek yoghurt with berries; turkey burger bowl; chicken skewers with salad; lamb salad bowl; omelette with vegetables; roast chicken with pumpkin and greens.

## 4. Tone and Writing Style

Tone: clear, human, warm, practical, evidence-based, beginner-friendly, non-alarmist, non-judgmental, commercially useful but not manipulative.

**Avoid:** exaggerated promises, miracle-cure language, fear-based marketing, medical overclaiming, unexplained jargon, extreme diet ideology, "carbs are always bad", "insulin is the enemy", "this platform can cure disease".

**Use language such as:** "may support", "can help improve", "is associated with", "may contribute to better metabolic health", "can support blood sugar stability", "discuss this with your doctor", "educational information only", "not a substitute for medical advice".

**Never use claims such as:** "cures insulin resistance", "reverses PCOS", "heals fatty liver guaranteed", "stop your medication", "lose X kg guaranteed", "no doctor needed".

## 5. Medical and Compliance Positioning

The platform must always remain educational. Every relevant medical page and every meal plan must include a disclaimer similar to:

> This content is for educational purposes only and does not replace medical advice, diagnosis or treatment. If you have diabetes, PCOS, fatty liver disease, kidney disease, advanced liver disease, are pregnant or breastfeeding, take insulin or glucose-lowering medication, or have a history of eating disorders, speak with a qualified healthcare professional before making major dietary changes.

Extra caution required for: type 1 diabetes, pregnancy, breastfeeding, insulin use, sulfonylureas / hypoglycaemia-risk medication, kidney disease, advanced liver disease, eating disorders, children and teenagers, complex medical cases. For these users: education only + recommend professional medical supervision.

## 6. Evidence Standards

Prioritise evidence in this order: international medical guidelines → consensus statements → systematic reviews → meta-analyses → umbrella reviews → randomised controlled trials → large cohort studies → mechanistic studies → reputable medical education sources.

Important source categories: American Diabetes Association, CDC, NIH, NHS, Diabetes UK, Diabetes Australia, EASL, EASD, EASO, Endocrine Society, international evidence-based PCOS guidelines, peer-reviewed journals, PubMed-indexed research.

Every major article should contain: simple explanation, practical interpretation, what the evidence says, what the evidence does not prove, source links, limitations, actionable steps. Avoid building strong claims on weak, isolated or low-quality studies.

## 7. Core Content Pillars

### Pillar 1 — Insulin Resistance (foundation of the whole platform)
Topics: what is insulin / blood sugar / insulin resistance / hyperinsulinaemia; how IR can exist before high blood sugar appears; HOMA-IR, fasting glucose, fasting insulin, HbA1c; associated symptoms; why diagnosis is medical; tests to discuss with a doctor; how nutrition, weight loss, movement and sleep influence insulin sensitivity.

Core message: **Insulin resistance is not only about diabetes. It can be connected to appetite, cravings, abdominal fat, fatty liver, PCOS, metabolic syndrome and long-term cardiometabolic risk.**

### Pillar 2 — Fatty Liver Disease / NAFLD / MASLD
Use current terminology: fatty liver disease, non-alcoholic fatty liver disease, NAFLD, MASLD, metabolic dysfunction-associated steatotic liver disease.
Topics: what is fatty liver / MASLD; connection to insulin resistance; why the liver overproduces glucose in IR; role of visceral fat; ALT/AST/GGT; ultrasound; weight loss effects; dietary patterns; alcohol/sugar-sweetened beverages/ultra-processed foods; practical first steps.

Core message: **Fatty liver is often not just a liver problem. It is commonly a metabolic problem connected with insulin resistance, visceral fat, excess energy intake, triglycerides and lifestyle.**

### Pillar 3 — Obesity and Abdominal Fat
Topics: obesity and IR; abdominal/visceral fat; inflammation; appetite regulation; cravings; why weight loss feels difficult; willpower isn't the whole story; calories vs insulin; role of protein/fibre; ultra-processed foods; sustainable calorie deficit; meal structure for satiety.

Core message: **Obesity and insulin resistance can reinforce each other. The goal is not extreme dieting, but building meals that reduce hunger, stabilise energy and make a moderate calorie deficit easier to maintain.**

### Pillar 4 — PCOS and Insulin Resistance
Topics: what is PCOS; connection to IR; high insulin and androgens; cravings; weight gain; T2D risk; fatty liver link; nutrition strategies (high-protein meals, fibre-rich carbs, low-GI, Mediterranean-style); movement/strength training; tests to discuss with a doctor.

Core message: **PCOS is not only a reproductive condition. For many women, it also has a metabolic component, and insulin resistance may influence weight, cravings, cycle irregularity and long-term metabolic risk.**

Do not claim nutrition cures PCOS — say it **may support** metabolic management and **may improve selected markers**.

### Pillar 5 — Metabolic Syndrome / Metabolic Disease
Topics: definition; waist circumference; triglycerides; HDL; blood pressure; fasting glucose; insulin resistance; cardiovascular risk; T2D risk; fatty liver connection; inflammation; tests to monitor; dietary/lifestyle strategies.

Core message: **Metabolic syndrome is not one single disease, but a cluster of signals showing that metabolism is under pressure. Insulin resistance is one important mechanism connecting these problems.**

## 8. Nutrition Philosophy

No rigid or extreme diet. The approach is: evidence-based, high-protein where appropriate, high-fibre, minimally processed, focused on satiety and blood sugar stability, adapted to country and user profile, flexible, sustainable, realistic.

Core principles: protein at every meal · fibre-rich foods daily · vegetables before/with carbohydrates · carbohydrates not banned but selected/portioned/combined intelligently · reduce sugar-sweetened beverages · reduce ultra-processed foods · prefer minimally processed carbohydrates · pair carbs with protein/fibre/healthy fats · encourage savoury breakfasts where useful · encourage 10–15 min walking after meals where appropriate · support gradual weight loss if needed · build repeatable meals, not complicated diets.

Avoid simplistic messaging like "carbs are bad" — the real problem is usually the *combination* of: excess calories, refined carbohydrates, added sugars, low fibre, low protein, high-fat+high-sugar ultra-processed foods, sedentary lifestyle, poor sleep, stress, visceral fat.

## 9. Website Structure

Main pages: Home · What Is Insulin Resistance? · Symptoms and Tests · Insulin Resistance and Fatty Liver · Insulin Resistance and Obesity · Insulin Resistance and PCOS · Insulin Resistance and Metabolic Syndrome · Nutrition for Insulin Resistance · The Blood Sugar Balance Plate · Studies Explained · Quiz · 21-Day Meal Plan · Recipes · Free Guide · About · Medical Disclaimer.

Main navigation: Home · Insulin Resistance · Fatty Liver · Obesity · PCOS · Metabolic Syndrome · Nutrition · Studies Explained · Quiz · Meal Plan.

> See **§24 Current Build Status** below for which of these actually exist in the codebase today.

## 10. Content Format for Educational Articles

Structure: simple introduction → what the topic means → how it connects to insulin resistance → why it matters → what the evidence says → practical food/lifestyle application → common mistakes → what not to overclaim → when to speak with a doctor → sources.

Each article should answer: (1) What is happening in the body? (2) Why does it matter for insulin resistance? (3) What do studies/guidelines suggest? (4) What can the user do at the next meal?

## 11. Studies Explained Section

Purpose: translate medical research into simple, practical, non-exaggerated explanations. Each study page: title, type of evidence, what was studied, key findings, practical meaning, limitations, what this does not prove, source link. Goal: build trust, not overwhelm with science.

## 12. Quiz Strategy

The quiz identifies the user's profile and guides them toward the right educational path and meal plan. It must collect: country, region/state, preferred grocery stores, food budget, main goal, metabolic context, known diagnoses, recent blood tests, symptoms, body data, activity level, eating pattern, allergies, intolerances, excluded foods, religious/personal restrictions, preferred proteins/carbs/vegetables, cooking time, work/lifestyle constraints, family needs, meal prep preferences.

**The quiz must not diagnose** — it only returns an educational profile.

First quiz question: **Which country are you building your plan for?** → United States / United Kingdom / Australia → branch accordingly.

## 13. Quiz Localisation

**US branch:** state/region (Northeast, Midwest, South, West, California, Texas, Florida, New York, Other), stores (Walmart, Costco, Trader Joe's, Whole Foods, Kroger, Target, Aldi, Safeway), budget (under $60/wk, $60–100, $100–150, $150+), units (cups/oz/lbs or grams/ml).

**UK branch:** nation (England/Scotland/Wales/Northern Ireland; if England, region — North East, North West, Yorkshire and the Humber, East Midlands, West Midlands, East of England, London, South East, South West), stores (Tesco, Aldi, Lidl, Sainsbury's, Asda, Morrisons, Waitrose, Ocado, Iceland), budget (under £40/wk, £40–70, £70–100, £100+), units in grams/ml.

**AU branch:** state/territory (NSW, VIC, QLD, WA, SA, TAS, ACT, NT), stores (Woolworths, Coles, Aldi, IGA, local markets), budget (under A$70/wk, A$70–120, A$120–180, A$180+), units in grams/ml.

## 14. Quiz MVP (~18 questions)

1. Country · 2. Region/state · 3. Usual stores · 4. Weekly food budget · 5. Main goal · 6. Told you have IR/fatty liver/PCOS/prediabetes/metabolic syndrome? · 7. Recent blood tests? · 8. Age · 9. Sex · 10. Height & weight · 11. Activity level · 12. Meals per day · 13. Biggest challenge (cravings/hunger/weight loss/fatigue/chaotic eating) · 14. Allergies · 15. Intolerances · 16. Avoided foods · 17. Daily cooking time · 18. Meal type needed (quick/budget/family/work lunch/meal prep).

## 15. Advanced Quiz (~35–45 questions)

Adds: waist circumference, known lab values (fasting glucose, fasting insulin, HOMA-IR, HbA1c, triglycerides, HDL, LDL, ALT, AST, GGT, TSH), medications, pregnancy/breastfeeding, type 1 diabetes, eating disorder history, kidney disease, advanced liver disease, work pattern, cooking skill, eating-out frequency, cravings timing, emotional eating, disliked foods, religious restrictions.

## 16. Quiz Safety Questions (mandatory screening)

Ask: type 1 diabetes? pregnant? breastfeeding? kidney disease? advanced liver disease? history of eating disorders? take insulin? take hypoglycaemia-risk medication? under 18?

If yes to any high-risk category → show a cautious message and recommend professional medical supervision before using any meal plan.

## 17. Quiz Result Profiles

1. **Weight Loss + Insulin Resistance** → high-protein, fibre, reduce ultra-processed foods, structured meals, walk after meals, moderate deficit. Product: *21-Day Insulin Resistance Meal Plan — Weight Loss Edition*.
2. **Fatty Liver + Insulin Resistance** → reduce sugar-sweetened drinks/alcohol, protein every meal, fibre, gradual weight loss, Mediterranean-style, liver-friendly meals. Product: *Fatty Liver & Insulin Resistance Meal Plan*.
3. **PCOS + Insulin Resistance** → savoury breakfast, protein+fibre, smart carbs, cravings management, strength training/walking, insulin/hormone education. Product: *PCOS & Insulin Resistance Meal Plan*.
4. **Metabolic Syndrome** → Mediterranean-style, high-fibre carbs, protein, unsaturated fats, less ultra-processed food/alcohol, BP/lipid awareness. Product: *Metabolic Health Meal Plan*.
5. **Prediabetes / T2D Risk** → blood sugar-friendly meals, carb quality/portion awareness, movement after meals, weight loss if needed, medical monitoring. Product: *Prediabetes & Blood Sugar Balance Plan*.
6. **Beginner Metabolic Reset** (no clear diagnosis/labs, but cravings/fatigue/confusion) → basic education, 7 rules for blood sugar balance, simple meal structure, free guide first. Products: *Beginner 7-Day Blood Sugar Balance Guide* → then *21-Day Insulin Resistance Meal Plan*.

> Current code (`lib/quiz/matcher.ts`) uses profile keys `pcos`, `prediabetes`, `nafld`, `metabolic_syndrome`, `insulin_resistance`, `general_wellness` mapped to UI colors `forest|sage|clay|honey` — treat these as the technical implementation of profiles 1–6 above; keep names aligned when extending the matcher.

## 18. Post-Quiz Roadmap

Each user should receive, not just a label: their educational profile; what that profile means; top 3–5 priorities; what to read first; practical first steps; recommended free guide; recommended paid plan; safety disclaimer.

Example:
> **Your Profile: Fatty Liver + Insulin Resistance**
> **What this means:** Your answers suggest your main educational focus should be the connection between insulin resistance, liver fat, abdominal fat and blood sugar regulation.
> **Your first priorities:** 1) reduce sugar-sweetened drinks 2) build protein-rich meals 3) increase fibre 4) reduce alcohol 5) walk after meals where possible.
> **Start here:** What Is Insulin Resistance? · Fatty Liver and Insulin Resistance · The Blood Sugar Balance Plate
> **Recommended plan:** Fatty Liver & Insulin Resistance Meal Plan — adapted to your country.

## 19. Paid Products

**Main product: 21-Day Insulin Resistance Meal Plan**, in three localised editions (US / UK / Australia), each including: educational introduction, nutrition rules, 21-day plan, country-specific grocery list, recipes, meal prep guidance, substitutions, allergy-aware alternatives, shopping list, budget options, quick meals, family-friendly options, work lunch ideas, blood sugar balance explanations, tracking sheet, medical disclaimer.

**Future products (after validating the first):** Fatty Liver & Insulin Resistance Plan · PCOS & Insulin Resistance Plan · Metabolic Syndrome Plan · Prediabetes & Blood Sugar Balance Plan · Gluten-Free Insulin Resistance Plan · Recipe Pack (100 Blood Sugar-Friendly Meals) · Monthly membership with seasonal meal plans/recipes.

> Current live offers (`lib/lemon-squeezy/checkout.ts`) are `plan-starter-kit` ($27 one-time), `subscription-core-monthly` ($29/mo), `subscription-core-annual` ($199/yr) — see Part 2 §Lemon Squeezy. These don't yet match the localised-21-day-plan structure described above; reconcile deliberately rather than assuming they're equivalent.

## 20. Free Lead Magnet

Title: **7 Rules for Blood Sugar Balance** (alternatives: *Beginner's Guide to Insulin Resistance* · *7-Day Blood Sugar Balance Starter Guide* · *The Insulin Resistance Plate Guide* · *What to Eat First When You Have Insulin Resistance*).

Contents: simple IR explanation, 7 practical rules, meal examples, country-specific food examples, grocery basics, warning signs requiring medical advice, invitation to take the quiz, invitation to purchase the 21-day plan.

> Not yet built in the codebase — see §24.

## 21. Email Funnel

Day 0: quiz result + recommended direction · Day 1: what is insulin resistance? · Day 2: cravings aren't just lack of willpower · Day 3: building a blood sugar-friendly plate · Day 4: common food mistakes · Day 5: what studies say about weight loss and insulin sensitivity · Day 6: a practical day of eating for your profile · Day 7: offer the paid meal plan. Educational first, commercial last.

> Current implementation (`lib/resend/emails.ts`, `app/api/cron/nurture/`) runs a **14-day** sequence, not 7 — this is an intentional superset, not a bug. Keep the 14-day cadence; don't shrink it to match this section without discussing first.

## 22. Additional Website Features (build over time)

User Roadmap (personalised journey from quiz results) · Metabolic Dashboard (weight, waist, cravings, hunger, energy, post-meal sleepiness, steps, meals completed, glucose/lab values if tracked) · Recipe Library (filterable by country/condition/goal/cooking time/budget/allergies/diet type; each recipe with ingredients, prep time, servings, calorie/protein/fibre/carb estimates, substitutions, why it supports blood sugar stability) · Shopping List Generator (US/UK/AU + budget/protein/fibre/veg/snack/pantry lists) · "What Should I Eat If…" articles (cravings at night, fatty liver, PCOS, high fasting glucose, shift work, no time to cook, eating at a restaurant, lactose intolerant, low budget) · Visual Plate Guides (IR, fatty liver, PCOS, metabolic syndrome, prediabetes, weight loss, work lunches, family dinners) · Myth-Busting (do carbs cause IR? cut bread completely? are fruits bad? potatoes? rice? is keto the only solution? IR without being overweight? normal glucose = no IR? fatty liver only from alcohol?) · Meal Plan Preview (sample day/recipe/grocery list/explanation + US/UK/AU diffs before purchase) · FAQ Section · Eating Out Guide (restaurants, fast food, cafés, on-the-go supermarket, cuisines, pubs, diners, takeaway) · Food Swaps (sugary cereal → Greek yoghurt+berries+chia+nuts; white toast+jam → eggs+avocado+tomatoes; plain pasta → pasta+chicken+veg+salad first; sweet snack → cottage cheese+berries+nuts; soda → sparkling/unsweetened drink) · 7-Day Blood Sugar Balance Challenge (savoury breakfast → fibre before carbs → protein every meal → walk after meals → remove sugary drinks → balanced dinner → plan next week; used to sell the 21-day plan).

## 23. Monetisation Strategy

Layers: free quiz → free guide → paid 21-day meal plan → email sequence → recipe packs → condition-specific plans → membership. Start simple: website + quiz + PDF/digital meal plan + email capture + checkout + simple product delivery. Later: interactive dashboard, app, membership, AI-supported meal planning, country-specific seasonal plans.

> The original strategy doc names "Stripe checkout" — **the live implementation uses Lemon Squeezy as Merchant of Record instead.** Keep using Lemon Squeezy; do not migrate to Stripe without an explicit decision (Lemon Squeezy handles VAT/sales tax MoR duties across US/UK/AU, which Stripe alone does not).

Suggested pricing — **US:** starter $19–39, full plan $39–79, membership $9–19/mo. **UK:** starter £15–29, full plan £29–59, membership £9–15/mo. **Australia:** starter A$29–49, full plan A$49–89, membership A$12–25/mo.

## 24. Recommended Build Order

**Phase 1 — Foundation:** brand/positioning · homepage · core educational pages · medical disclaimer · evidence standards page · quiz MVP · free guide · 21-day paid plan structure.
**Phase 2 — First Monetisation:** US/UK/AU editions of the 21-day plan · checkout · post-quiz recommendation · email capture · 7-day email funnel · meal plan preview page.
**Phase 3 — SEO & Content Growth:** 50 foundational articles · Studies Explained section · myth-busting content · "What should I eat if…" content · recipe library · eating-out guides.
**Phase 4 — Product Expansion:** Fatty Liver plan · PCOS plan · Metabolic Syndrome plan · Prediabetes plan · Gluten-free plan · recipe packs · membership.
**Phase 5 — Advanced Platform:** metabolic dashboard · shopping list generator · interactive meal planner · user accounts · progress tracking · AI-assisted plan adaptation · mobile app if validated.

### Current Build Status (verified against the codebase, 2026-06-30)

**Phase 1 — mostly done, some gaps:**
- ✅ Homepage, condition hub pages for PCOS / NAFLD / Prediabetes / Obesity (`app/pcos`, `app/nafld`, `app/prediabetes`, `app/obesity`)
- ⚠️ No dedicated hub for "Insulin Resistance" itself or "Metabolic Syndrome" — covered only as `/learn` articles, not standalone hubs
- ✅ Medical disclaimer component, scientific integrity / evidence page (`app/about/scientific-integrity/`)
- ✅ Research Sources page (`app/about/sources/`) — 32 primary references with PubMed + DOI links, grouped by condition; linked from footer + Scientific Integrity page
- ✅ Citation audit completed (2026-06-30): all MDX hub pages and learn articles use proper peer-reviewed citations — no databases (ScienceDirect, PMC) cited as journals, no vague/unverifiable attributions
- ✅ Quiz: 9-step MVP with **§16 safety screening fully implemented** — step 8 collects `SafetyFlag[]` (type1_diabetes, pregnant, breastfeeding, kidney_disease, advanced_liver_disease, eating_disorder_history, takes_insulin, hypoglycemia_risk_medication, under_18 — see `lib/quiz/types.ts`), results page renders `<SafetyNotice>` (`components/quiz/SafetyNotice.tsx`) before paid CTA
- ✅ SEO scaffolding: `app/robots.ts`, `app/sitemap.ts`, `app/opengraph-image.tsx`
- ✅ Auth utility pages built at root: `app/forgot-password/`, `app/reset-password/`, `app/settings/`
- ❌ Free guide / lead magnet (§20): not built
- ⚠️ 21-Day Meal Plan with US/UK/AU editions: not built as content; current paid offers (`plan-starter-kit`, `subscription-core-monthly`, `subscription-core-annual`) don't match §19 structure

**Phase 2 — partially done:**
- ✅ Checkout via Lemon Squeezy + HMAC-verified webhook, double opt-in newsletter (confirm/unsubscribe), idempotent nurture enrollment
- ✅ Nurture sequence: **14-day** (intentional superset of §21's 7-day — keep it). All 14 email templates in `lib/resend/emails.ts` are scientifically audited — citations verified, no fake testimonials, no phantom features
- ❌ Meal plan preview page: not built

**Phase 3 — early stage:**
- 4 `/learn` MDX articles (`what-is-insulin-resistance`, `metabolic-syndrome`, `microbiome`, `nutrition`) + 4 hub pages — far short of 50-article goal (§25)
- CMS article system scaffolded (`articles` table, `/learn/[slug]`) — confirm row count before assuming populated
- ⚠️ `data/food-research/` — food research database (see §28 below) is built and populated with US/UK/AU dish JSON
- ❌ Studies Explained, myth-busting, "What should I eat if…": not built
- ⚠️ Recipe library: `app/recipes/` directory scaffolded but empty

**Phase 4 & 5 — not started.** No condition-specific plans beyond 3 LS tiers, no metabolic dashboard beyond basic `dashboard/` area, no AI-assisted planning.

**Suggested next priorities:** free lead magnet (§20) → more `/learn` articles toward 50 → meal plan preview page.

## 25. First 50 Article Ideas

**Insulin Resistance Basics:** What Is Insulin Resistance? · What Is Insulin? · What Is Blood Sugar? · What Is Hyperinsulinaemia? · What Is HOMA-IR? · What Is Fasting Insulin? · What Is HbA1c? · Can You Have Insulin Resistance With Normal Glucose? · Signs You May Have Insulin Resistance · What Tests Should You Discuss With Your Doctor?

**Fatty Liver:** What Is Fatty Liver Disease? · What Is MASLD? · Fatty Liver and Insulin Resistance · Fatty Liver and Abdominal Fat · ALT, AST and GGT Explained · What Foods Support Fatty Liver Improvement? · Sugar-Sweetened Drinks and Fatty Liver · Alcohol and Fatty Liver · Weight Loss and Fatty Liver · Fatty Liver Meal Plan Basics.

**Obesity:** Obesity and Insulin Resistance · What Is Visceral Fat? · Why Belly Fat Matters · Why Weight Loss Can Be Difficult With Insulin Resistance · Hunger, Cravings and Insulin Resistance · Protein and Satiety · Fibre and Weight Loss · Calories vs Insulin · Ultra-Processed Foods and Weight Gain · How to Build a Weight Loss Plate.

**PCOS:** What Is PCOS? · PCOS and Insulin Resistance · PCOS and Cravings · PCOS and Weight Gain · PCOS and Type 2 Diabetes Risk · PCOS and Fatty Liver · Best Breakfast Ideas for PCOS · Carbohydrates and PCOS · Movement and PCOS · PCOS Meal Plan Basics.

**Metabolic Syndrome and Nutrition:** What Is Metabolic Syndrome? · Metabolic Syndrome and Insulin Resistance · Triglycerides and Insulin Resistance · HDL and Metabolic Health · Blood Pressure and Metabolic Syndrome · Mediterranean Diet and Metabolic Health · Low-Carb vs Mediterranean Diet for Insulin Resistance · Are Carbs Bad for Insulin Resistance? · What Should I Eat for Stable Blood Sugar? · 7 Rules for Better Blood Sugar Balance.

## 26. Claude Working Rules for This Project

1. Think from the perspective of a beginner user.
2. Keep information simple but scientifically responsible.
3. Connect every major topic back to insulin resistance.
4. Avoid medical overclaims.
5. Use evidence-based reasoning; prefer guidelines, meta-analyses, systematic reviews, clinical research.
6. Explain limitations.
7. Convert science into practical food decisions.
8. Adapt all meal plans to US, UK and Australia.
9. Ask for missing user-specific details only when needed.
10. Avoid creating a generic global plan.
11. Always consider allergies, intolerances and excluded foods.
12. Keep monetisation in mind without making content feel manipulative.
13. Maintain a clean educational tone.
14. Separate educational content from paid product recommendations.
15. Ensure all paid plans include disclaimers and safety warnings.
16. Build products progressively, not all at once.
17. Prioritise launchable MVPs.
18. Make recommendations practical and actionable.
19. Treat the quiz as the main segmentation and conversion engine.
20. Before claiming a feature exists or is missing, check the actual code (see §24 status) — don't assume the vision doc reflects current reality.

## 27. Final Strategic Summary

InsulinIQ is a focused, evidence-based education and meal-planning platform. Central mechanism: **insulin resistance**. Connected conditions: fatty liver/MASLD, obesity, PCOS, metabolic syndrome, prediabetes, cravings/appetite dysregulation. Practical solution: **nutrition education + structured meal planning + country-specific adaptation + sustainable behaviour change.** Business model: **free educational content + quiz + lead magnet + paid 21-day meal plan + specialised plans + membership.**

The first version is not a complex app — it is: website + core educational content + quiz + free guide + paid meal plan + email funnel + evidence library + medical disclaimer. The project must always remain medically responsible, evidence-based and commercially focused.

---

# PART 2 — Technical Implementation Guide (Romanian)

## Ce este InsulinIQ
Platformă educațională despre rezistența la insulină, PCOS, NAFLD, prediabet, obezitate și sindrom metabolic. Piețe: SUA, UK, Australia. Scop: educație, nu diagnostic. Nicio afirmație medicală fără sursă citată.

---

## Comenzi

```bash
npm run dev        # dev server pe localhost:3000
npm run build      # production build — rulează înainte de orice deploy
npm run lint       # ESLint (nu rulează automat la build — ignoreDuringBuilds: true)
vercel --prod      # deploy în producție
```

Nu există test suite configurat. `typescript.ignoreBuildErrors: true` în `next.config.mjs` — erorile TS nu blochează build-ul, dar trebuie rezolvate oricum.

---

## Stack tehnic — nu devia
- **Next.js 15 App Router** — Server Components by default
- **TypeScript strict** — fără `any`, fără `// @ts-ignore`
- **Tailwind CSS v3** + shadcn/ui (Radix-based, nu `@base-ui/react`)
- **Supabase** (`@supabase/ssr`) — auth + PostgreSQL + pgvector
- **Lemon Squeezy** — plăți (Merchant of Record)
- **Resend** — emailuri tranzacționale
- **Vercel** — deployment cu cron job zilnic; **Plausible** — analytics (nu GA4)
- **AI SDK** (`@anthropic-ai/sdk`, `ai`, `@ai-sdk/anthropic`) — instalate în `package.json`, dar **neintegrate**: `lib/ai/` și `app/ai-assistant/` sunt goale. Dashboard-ul marchează AI assistant ca „Coming Q3 2026". Nu presupune că funcționalitatea există doar pentru că dependențele sunt prezente.

---

## Arhitectura conținutului — două sisteme paralele

**Hub pages (MDX static)** — condiții cu pagini dedicate:
- `/pcos` → `app/pcos/page.mdx`
- `/nafld` → `app/nafld/page.mdx`
- `/prediabetes` → `app/prediabetes/page.mdx`
- `/obesity` → `app/obesity/page.mdx`

**Articole MDX în /learn:**
- `app/learn/what-is-insulin-resistance/page.mdx`
- `app/learn/metabolic-syndrome/page.mdx`
- `app/learn/microbiome/page.mdx`
- `app/learn/nutrition/page.mdx`

**CMS articles (Supabase)** — articole viitoare:
- `/learn` → `app/learn/page.tsx` — afișează carduri MDX statice + articole din `articles` table
- `/learn/[slug]` → `app/learn/[slug]/page.tsx` — render HTML din coloana `articles.content`

**Regula critică:** Hub-urile de condiție au directoarele lor la root (`app/pcos/`, `app/nafld/` etc.), **nu** în `app/learn/`. Nu crea sub-directoare în `app/learn/` pentru condiții care au hub propriu.

---

## Structura rutelor

```
app/
├── page.tsx                    # Homepage — include SiteHeader/SiteFooter direct
├── (marketing)/layout.tsx      # Route group — DOAR layout, fără pagini cu Client imports
├── about/scientific-integrity/ # Pagina de integritate științifică
├── api/
│   ├── auth/callback/          # OAuth + magic link callback Supabase
│   ├── confirm-email/          # Double opt-in newsletter
│   ├── cron/nurture/           # Cron zilnic 08:00 UTC — secvența 14 zile email
│   ├── unsubscribe/            # Dezabonare newsletter cu token semnat
│   └── webhooks/lemon-squeezy/ # Webhook plăți (HMAC-SHA256 verificat)
├── dashboard/                  # Zona autentificată
├── forgot-password/ & reset-password/ & settings/ # Auth/account utility pages (la root, vezi nota de mai jos)
├── learn/[slug]/               # Articole CMS din Supabase
├── legal/disclaimer|privacy|terms/
├── login/ & register/          # Auth pages
├── pricing/                    # Pagina prețuri (3 tiere)
├── quiz/ & quiz/results/       # Flux quiz 9 pași (include safety screening)
├── recipes/                    # Scaffold gol — fără conținut încă
├── robots.ts & sitemap.ts & opengraph-image.tsx # SEO metadata generators
└── [pcos|nafld|prediabetes|obesity]/ # Hub-uri condiții (MDX)
```

**Nu folosi route groups** (ex: `(marketing)`) pentru pagini care importă Client Components — provoacă eroarea `page_client-reference-manifest.js` pe Vercel. Route groups sunt sigure doar pentru layout-uri care împachetează exclusiv Server Components.

**Directoare moarte — nu adăuga pagini în ele:** `app/(auth)/login/`, `app/(auth)/register/`, `app/(auth)/forgot-password/`, `app/(dashboard)/dashboard/`, `app/(dashboard)/settings/` există pe disc dar sunt **complet goale** (fără `page.tsx`) — rest dintr-o arhitectură route-groups abandonată. Paginile reale sunt la `app/login/`, `app/register/`, `app/dashboard/`, `app/forgot-password/`, `app/reset-password/`, `app/settings/` (fără paranteze, toate construite la root). Dacă mai adaugi pagini de auth/cont noi, urmează același pattern — root, nu în directoarele `(auth)`/`(dashboard)` — altfel risc de rute duplicate/conflict.

**Layout-uri:** Root `app/layout.tsx` nu include `SiteHeader`/`SiteFooter`. Fiecare secțiune are propriul `layout.tsx`. Homepage include header/footer direct în componentă.

---

## Pattern-uri de implementare

### Supabase client
```ts
// Server Components / Server Actions / Route Handlers:
import { createClient } from "@/lib/supabase/server";
const supabase = await createClient(); // async — folosește cookies()

// Webhook + cron routes (bypass RLS — NUMAI aici și în Server Actions justificate):
import { createClient } from "@supabase/supabase-js";
const admin = createClient(url, process.env.SUPABASE_SERVICE_ROLE_KEY!);

// Client Components:
import { createClient } from "@/lib/supabase/client";
```

### Database types
`types/database.ts` este **menținut manual**. Structura obligatorie cu toate cele 5 sub-chei (altfel `.from()` returnează `never`):
```ts
export interface Database {
  public: {
    Tables: { [table]: { Row; Insert; Update; Relationships: [] } };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
```
Când adaugi o coloană, actualizează Row + Insert + Update în același commit.

### Server Actions
```ts
"use server";
// Zod — folosește .issues[0].message (nu .errors[0].message — aia e Yup)
const parsed = schema.safeParse(data);
if (!parsed.success) return { error: parsed.error.issues[0].message };

// Insert fără .select().single() — evită eroarea de tip never[] când RLS SELECT ≠ INSERT
await supabase.from("table").insert({ ... });

// redirect() aruncă intern în Next.js — nu îl pune în try/catch; apelează-l DUPĂ try block
```

### Server Actions — directorul `actions/`
| Fișier | Responsabilitate |
|---|---|
| `actions/auth.ts` | `loginAction`, `registerAction`, `logoutAction` |
| `actions/checkout.ts` | Inițiere checkout Lemon Squeezy |
| `actions/newsletter.ts` | Abonare / dezabonare newsletter |
| `actions/nurture.ts` | `enrollInNurture(email)` — idempotent, bypass RLS |
| `actions/quiz.ts` | Salvare răspunsuri quiz în `quiz_results` |

### Middleware
`middleware.ts` apelează `updateSession()` din `lib/supabase/middleware.ts` pe toate rutele (exceptând assets statice). Nu adăuga logică în `middleware.ts` direct — extinde `lib/supabase/middleware.ts`.

### MDX articles
```mdx
import { MedicalDisclaimer } from "@/components/content/MedicalDisclaimer";

export const metadata = { title: "...", description: "..." };

<article className="mx-auto max-w-3xl px-4 sm:px-6 py-12">
  {/* conținut */}
  <MedicalDisclaimer />
</article>
```
Import **named** (`{ MedicalDisclaimer }`), nu default. Necesită `mdx-components.tsx` la rădăcina proiectului și `pageExtensions` cu `mdx` în `next.config.mjs` (deja configurat).

### FAQ Schema (SEO)
```tsx
import { SchemaFAQ } from "@/components/content/SchemaFAQ";
// Adaugă imediat înainte de secțiunea ## Frequently Asked Questions în MDX
<SchemaFAQ items={[{ question: "...", answer: "..." }]} />
```
Injectează FAQPage JSON-LD pentru Google Featured Snippets.

---

## Secvența nurture email (14 zile)

Flux complet: quiz cu email capturat → `enrollInNurture(email)` în `app/quiz/results/page.tsx` → rând în `newsletter_subscribers` cu `nurture_started_at` setat → cron zilnic `/api/cron/nurture` la 08:00 UTC trimite emailul zilei corespunzătoare via `sendNurtureEmail(email, day)` din `lib/resend/emails.ts`.

- `enrollInNurture` este idempotent — sigur de apelat la fiecare reload al paginii de rezultate
- Cron verifică header `Authorization: Bearer <CRON_SECRET>` înainte de orice operație DB — **nu** `x-cron-secret` (Vercel Cron nu trimite acel header; folosește `Authorization: Bearer`, vezi `app/api/cron/nurture/route.ts`)
- `nurture_completed = true` după ziua 14
- Numai subscribers cu `confirmed = true` primesc emailurile (double opt-in separat)

---

## Sistemul quiz

9 pași (tipuri în `lib/quiz/types.ts`, `QuizStep = 1 | ... | 9`): goal → region → symptoms → diet → allergens → cooking_time → skill → **safety screening** → email (gate).

Pasul 8 (safety screening) colectează `safetyFlags: SafetyFlag[]` — `type1_diabetes | pregnant | breastfeeding | kidney_disease | advanced_liver_disease | eating_disorder_history | takes_insulin | hypoglycemia_risk_medication | under_18`. Implementează §16 din Part 1.

`QuizAnswers` → `matchProfile()` din `lib/quiz/matcher.ts` → `MatchResult` cu `profileColor: "forest" | "sage" | "clay" | "honey"`, `profileLabel`, `description`, `articles[]`. Separat, `getSafetyNotice(answers)` din același fișier returnează un mesaj non-diagnostic dacă `safetyFlags.length > 0` — randat de `<SafetyNotice>` (`components/quiz/SafetyNotice.tsx`) pe `app/quiz/results/page.tsx`, **înainte** de secțiunea CTA plătită.

Profiluri metabolice: `pcos`, `prediabetes`, `nafld`, `metabolic_syndrome`, `insulin_resistance`, `general_wellness`.

> Vezi Part 1 §12–§17 pentru viziunea pe termen lung a quiz-ului (18 întrebări MVP → 35–45 avansat) — quiz-ul actual e o versiune simplificată a numărului de întrebări, dar safety screening-ul (§16) e deja implementat.

---

## Design system

Paleta naturală definită în `app/globals.css` (CSS variables HSL) și `tailwind.config.ts`:

| Scală Tailwind | Utilizare |
|---|---|
| `forest-*` | Primary, IR articles, CTA, navigație |
| `sage-*` | PCOS |
| `clay-*` | Prediabetes, CTAs conversie |
| `honey-*` | NAFLD / MASLD, highlight-uri |

**Culori dinamice la runtime — pattern anti-purge:**
```tsx
// GREȘIT — Tailwind va purga clasa construită dinamic:
<div className={`border-t-${color}`} />

// CORECT — inline style bypass purge:
<div className="border-t-[6px]" style={{ borderTopColor: accentColor(category) }} />
```
Acesta e pattern-ul folosit în `ArticleCard` și `RecipeCard`.

Componentele UI din `components/ui/` sunt implementări Radix/Tailwind v3 — **nu** `@base-ui/react`.

`SourceBadge` acceptă `level: "strong" | "moderate" | "emerging"`.

---

## Reguli de conținut medical — obligatorii
- Nicio afirmație medicală fără citare `(Autor, An)` în text
- Nicio promisiune de tip "vindecă", "inversează garantat", "tratament"
- `<MedicalDisclaimer />` **înainte** de orice CTA plătit sau recomandare de produs — nu după
- Testimoniale: fiecare trebuie să aibă `"Individual experience. Lifestyle outcomes vary."`
- Badge quiz results: `"Your educational profile"` — nu `"Your profile"` sau `"Your diagnosis"`

---

## Lemon Squeezy — planuri active

**Planuri noi (2026):**
| Plan ID | Preț | Culoare UI |
|---|---|---|
| `plan-starter-kit` | $27 one-time | clay-400 |
| `subscription-core-monthly` | $29/lună | forest-500 (featured) |
| `subscription-core-annual` | $199/an | honey-400 |

**Env vars necesare:** `LS_VARIANT_STARTER_KIT`, `LS_VARIANT_CORE_MONTHLY`, `LS_VARIANT_CORE_ANNUAL`

Planurile legacy (`plan-14-days`, `plan-21-days`, `plan-45-days`, `subscription-basic/premium/community`) sunt păstrate în `lib/lemon-squeezy/checkout.ts` pentru compatibilitate.

`PlanId = keyof typeof PLANS` — adăugarea în `PLANS` const extinde automat union type-ul.

Webhook-ul (`app/api/webhooks/lemon-squeezy/route.ts`) verifică HMAC-SHA256 și folosește `SUPABASE_SERVICE_ROLE_KEY` — singurul loc permis împreună cu `actions/nurture.ts` și `app/api/cron/nurture/route.ts`.

> Nu migra la Stripe — Lemon Squeezy e ales deliberat ca Merchant of Record pentru obligațiile fiscale (VAT/sales tax) pe SUA/UK/Australia simultan. Vezi Part 1 §23.

---

## Piețe
- **SUA**: mg/dL, cups/oz/°F, referințe Walmart/Whole Foods/Costco
- **UK**: mmol/L, grams/ml/°C, referințe Tesco/Sainsbury's/ALDI
- **Australia**: mmol/L, grams/ml/°C, referințe Woolworths/Coles/ALDI

---

## Supabase schema
Tabele principale (schema SQL completă în `supabase/schema.sql`):
`users`, `subscriptions`, `quiz_results`, `articles`, `recipes`, `documents` (pgvector), `newsletter_subscribers`

`newsletter_subscribers` are coloanele suplimentare (adăugate prin `supabase/migrations/add_nurture_columns.sql`):
- `nurture_started_at TIMESTAMPTZ` — null = neînrolat în secvența nurture
- `nurture_completed BOOLEAN DEFAULT FALSE` — true după ziua 14

RLS activat pe toate tabelele. `supabase/schema.sql` conține funcția `match_documents()` pentru RAG și trigger-ul `handle_new_user()` care creează rândul în `public.users` la signup.

---

## §28 Food Research Database (`data/food-research/`)

Baza de date de referință pentru generatorul de meal plans — nu e servită direct pe web, e un asset de development.

**Structură:**
```
data/food-research/
  SCHEMA.md              ← definițiile câmpurilor obligatorii și opționale
  us/breakfast.json  us/lunch.json  us/dinner.json  us/snacks.json
  uk/breakfast.json  uk/lunch.json  uk/dinner.json  uk/snacks.json
  au/breakfast.json  au/lunch.json  au/dinner.json  au/snacks.json
  us.md / uk.md / au.md  ← rezumate human-readable generate din JSON
```

**Reguli critice (din `SCHEMA.md`):**
- Fiecare dish trebuie să fie un fel de mâncare **real și verificabil** — nu inventat. Sursă obligatorie (site de rețete, pagina unui supermarket, ghid nutrițional guvernamental)
- Câmpuri obligatorii per dish: `name`, `country`, `meal_type`, `source_url`, `macros` (protein_g, carbs_g, fat_g, fibre_g, calories), `metabolic_tags` (ex: `"high_protein"`, `"low_gi"`, `"gut_health"`)
- `metabolic_tags` alimentează matchingul cu profilurile quiz — nu adăuga taguri fără bază nutrițională verificabilă

**Când adaugi dish-uri:** urmează schema din `SCHEMA.md`, nu adăuga rețete inventate, verifică macronutrienții față de o sursă reală (FoodData Central, NHS nutrient data, FSANZ).

---

## §29 `.env.local` — atenționări

Variabilele Lemon Squeezy din `.env.local` conțin **ID-uri de variante legacy** (`LS_VARIANT_14_DAYS`, `LS_VARIANT_21_DAYS`, `LS_VARIANT_45_DAYS`, `LS_VARIANT_SUB_BASIC` etc.) care nu mai corespund planurilor active din cod. Planurile active necesită:
- `LS_VARIANT_STARTER_KIT`
- `LS_VARIANT_CORE_MONTHLY`
- `LS_VARIANT_CORE_ANNUAL`

Acestea trebuie populate cu variant IDs reale din dashboard-ul Lemon Squeezy înainte de launch. Până atunci checkout-ul nu va funcționa în producție.
