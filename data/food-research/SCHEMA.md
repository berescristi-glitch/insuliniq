# Food Research Database — Schema

This directory is the source-of-truth research database for InsulinIQ's future meal-plan generator. It contains **real, verifiable dishes** actually eaten in the US, UK, and Australia — not invented or guessed recipes. Each entry must be traceable to a real source (recipe site, supermarket meal page, national food survey, government nutrition guide, or equivalent).

## Directory layout

```
data/food-research/
  SCHEMA.md              <- this file
  us/breakfast.json
  us/lunch.json
  us/dinner.json
  us/snacks.json
  uk/breakfast.json
  uk/lunch.json
  uk/dinner.json
  uk/snacks.json
  au/breakfast.json
  au/lunch.json
  au/dinner.json
  au/snacks.json
  us.md / uk.md / au.md  <- human-readable summaries generated from the JSON (built after the JSON files exist)
```

Each `<country>/<mealType>.json` file is a JSON array of dish objects following the schema below. No wrapping object — just `[ {...}, {...}, ... ]`.

## Dish object schema

```jsonc
{
  "id": "us-breakfast-001",                 // "<country>-<mealType>-<3-digit-sequence>"
  "name": "Veggie Egg Bites with Cottage Cheese",
  "country": "US",                          // "US" | "UK" | "AU"
  "mealType": "breakfast",                  // "breakfast" | "lunch" | "dinner" | "snack"
  "servings": 1,
  "popularityContext": "Why this is a real, commonly eaten dish in this country — e.g. popularized by meal-prep culture and coffee-chain breakfast menus.",
  "ingredients": [
    { "item": "eggs", "quantity": 3, "unit": "large" },
    { "item": "cottage cheese", "quantity": 0.25, "unit": "cup" }
  ],                                         // use country-correct units: US = cups/oz/lbs/°F, UK/AU = grams/ml/°C
  "prepNotes": "Short, practical prep steps (2-4 sentences max).",
  "nutrition": {
    "calories": 220,
    "protein_g": 22,
    "carbs_g": 4,
    "fiber_g": 1,
    "sugar_g": 2,
    "fat_g": 12,
    "method": "Calculated from ingredient composition via USDA FoodData Central"
    // method should name the real nutrition database used:
    // US -> USDA FoodData Central
    // UK -> McCance and Widdowson's Composition of Foods / UK Government nutrient databank
    // AU -> Australian Food Composition Database (NUTTAB / FSANZ)
  },
  "tags": {
    "proteinForward": true,                 // >=15g protein for a meal-class dish
    "fiberRich": false,                     // >=5g fiber
    "processingLevel": "minimal",           // "minimal" | "moderate" | "ultra-processed"
    "glycemicLoad": "low",                  // "low" | "medium" | "high" — internal categorization only, never shown to users as a diagnosis
    "irSuitability": "good",                // "good" | "moderate" | "needs-adaptation" — internal tag for meal-plan filtering
    "dietPatterns": ["vegetarian"],         // any of: vegetarian, vegan, gluten_free, dairy_free, pescatarian, halal, kosher, low_carb, mediterranean
    "allergens": ["eggs", "dairy"]          // plain-language allergens present
  },
  "regionAvailability": {
    "stores": ["Walmart", "Trader Joe's", "Whole Foods"],   // from CLAUDE.md's per-country store list
    "notes": "Ingredients available nationwide year-round."
  },
  "sources": [
    { "title": "Source confirming this is a real, commonly eaten dish", "url": "https://..." }
  ]
}
```

## Non-negotiable rules for every entry

1. **Real dishes only.** Every dish must be verifiable as something people actually eat in that country — confirm via web search before adding it. If you cannot find a real source, do not include the dish.
2. **No invented nutrition numbers.** Calculate calories/macros from real ingredient data in the country-appropriate nutrition database (see `nutrition.method` above). Round sensibly; do not present false precision.
3. **Country-correct units and stores.** Follow CLAUDE.md §3 (US: cups/oz/lbs/°F, Walmart/Costco/Trader Joe's/Whole Foods/Kroger/Target/Aldi/Safeway; UK: grams/ml/°C, Tesco/Sainsbury's/Asda/Aldi/Lidl/Morrisons/Waitrose/Ocado/Iceland; AU: grams/ml/°C, Woolworths/Coles/Aldi/IGA).
4. **No medical claims in any text field.** `irSuitability`/`glycemicLoad` are internal filter tags, not user-facing claims. Do not write "cures," "reverses," or similar in `popularityContext`/`prepNotes`.
5. **Diversity within a file.** Avoid near-duplicates (e.g. don't list 10 variations of "scrambled eggs" — vary proteins, formats, cuisines/cultural backgrounds present in that country, cooking methods, and budget levels).
6. **No duplicate `id` values** within a file; sequence numbers must be zero-padded 3 digits.
