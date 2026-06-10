# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## Ce este InsulinIQ
Platformă educațională despre rezistența la insulină, PCOS, NAFLD, prediabet, obezitate și sindrom metabolic. Piețe: SUA, UK, Australia. Scop: educație, nu diagnostic. Nicio afirmație medicală fără sursă citată.

---

## Comenzi

```bash
npm run dev        # dev server pe localhost:3000
npm run build      # production build (rulează înainte de orice deploy)
npm run lint       # ESLint
vercel --prod      # deploy în producție
```

Nu există test suite configurat momentan.

---

## Stack tehnic — nu devia
- **Next.js 14 App Router** — Server Components by default
- **TypeScript strict** — fără `any`, fără `// @ts-ignore`
- **Tailwind CSS v3** + shadcn/ui (Radix-based, nu `@base-ui/react`)
- **Supabase** (`@supabase/ssr`) — auth + PostgreSQL + pgvector
- **Lemon Squeezy** — plăți (Merchant of Record)
- **Resend** — emailuri tranzacționale
- **Vercel** — deployment; **Plausible** — analytics (nu GA4)

---

## Arhitectura conținutului — două sisteme paralele

**Hub pages (MDX static)** — prioritatea actuală:
- `/pcos` → `app/pcos/page.mdx` + `app/pcos/layout.tsx`
- `/nafld` → `app/nafld/page.mdx` + `app/nafld/layout.tsx`
- `/prediabetes` → `app/prediabetes/page.mdx` + `app/prediabetes/layout.tsx`
- `/learn/what-is-insulin-resistance` → `app/learn/what-is-insulin-resistance/page.mdx`

**CMS articles (Supabase)** — pentru articole viitoare:
- `/learn` → `app/learn/page.tsx` — afișează carduri MDX statice + articole din Supabase `articles` table
- `/learn/[slug]` → `app/learn/[slug]/page.tsx` — render HTML din coloana `articles.content`

**Regula critică:** Hub-urile de condiție (`/pcos`, `/nafld`, `/prediabetes`) sunt în directoarele lor dedicate, **nu** în `app/learn/`. Nu crea sub-directoare în `app/learn/` pentru condiții care au deja hub propriu.

---

## Pattern-uri de implementare

### Supabase client
```ts
// Server Components / Server Actions / Route Handlers:
import { createClient } from "@/lib/supabase/server";
const supabase = await createClient(); // async — folosește cookies()

// Webhook route (bypass RLS — DOAR aici):
import { createClient } from "@supabase/supabase-js";
const admin = createClient(url, process.env.SUPABASE_SERVICE_ROLE_KEY!);

// Client Components:
import { createClient } from "@/lib/supabase/client";
```

### Database types
Tipul `Database` din `types/database.ts` este **menținut manual** (nu generat din CLI). Structura obligatorie:
```ts
export interface Database {
  public: {
    Tables: { [table]: { Row, Insert, Update, Relationships: [] } };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
```
Fără `Views/Functions/Enums/CompositeTypes`, `.from()` returnează `never`.

### Server Actions
```ts
"use server";
// Validare cu Zod — folosește .issues[0].message (nu .errors[0].message)
const parsed = schema.safeParse(data);
if (!parsed.success) return { error: parsed.error.issues[0].message };

// Insert fără .select().single() — evită eroarea de tip never[]
await supabase.from("table").insert({ ... });
```

### MDX articles
Fiecare fișier `.mdx` trebuie să respecte exact acest pattern:
```mdx
import { MedicalDisclaimer } from "@/components/content/MedicalDisclaimer";

export const metadata = { title: "...", description: "..." };

<article className="mx-auto max-w-3xl px-4 sm:px-6 py-12">
  {/* conținut */}
  <MedicalDisclaimer />
</article>
```
Import **named** (`{ MedicalDisclaimer }`), nu default. Fișierele MDX necesită `mdx-components.tsx` la rădăcina proiectului și `pageExtensions` cu `mdx` în `next.config.mjs`.

### Layout-uri
Root `app/layout.tsx` nu include `SiteHeader`/`SiteFooter`. Fiecare secțiune are propriul `layout.tsx`:
- `app/learn/layout.tsx`, `app/pcos/layout.tsx`, `app/nafld/layout.tsx`, `app/prediabetes/layout.tsx`
- Homepage (`app/page.tsx`) include header/footer direct în componentă

**Nu folosi route groups** (ex: `(marketing)`) pentru pagini cu Client Component imports — provoacă eroarea `page_client-reference-manifest.js` pe Vercel.

---

## Design system

Paleta naturală InsulinIQ este definită în `app/globals.css` (CSS variables HSL) și extinsă în `tailwind.config.ts`:

| Scală Tailwind | Culoare | Utilizare |
|---|---|---|
| `forest-*` | Deep green | Primary, IR articles, CTA |
| `sage-*` | Muted sage green | PCOS |
| `clay-*` | Warm terracotta | Prediabetes |
| `honey-*` | Amber natural | NAFLD / MASLD |

Componentele UI din `components/ui/` sunt implementări Radix/Tailwind v3 — **nu** `@base-ui/react` (incompatibil cu Tailwind v3).

`ArticleCard` și `RecipeCard` au o bara de `border-t-[6px]` colorată dinamic cu `style={{ borderTopColor: accentColor(category) }}` — nu clase Tailwind dinamice (ar fi purgate).

`SourceBadge` (`components/content/SourceBadge.tsx`) acceptă `level: "strong" | "moderate" | "emerging"` și redă culoarea corespunzătoare condiției.

---

## Reguli de conținut medical — obligatorii
- Nicio afirmație medicală fără citare `(Autor, An)` în text
- Nicio promisiune de tip "vindecă" sau "inversează garantat"
- `<MedicalDisclaimer />` la finalul oricărui articol, rețetă sau plan alimentar
- Supabase: nu stoca date medicale sensibile fără consimțământ explicit (`quiz_results` e OK — nu conține diagnostice)

---

## Lemon Squeezy — produse și prețuri
| Plan | USD | GBP | AUD |
|---|---|---|---|
| plan-14-days | $19 | £16 | $29 |
| plan-21-days | $34 | £28 | $49 |
| plan-45-days | $59 | £49 | $84 |
| subscription-basic | $9/mo | — | — |
| subscription-premium | $19/mo | — | — |
| subscription-community | $24/mo | — | — |

Webhook-ul Lemon Squeezy (`app/api/webhooks/lemon-squeezy/route.ts`) verifică semnătura HMAC-SHA256 și folosește `SUPABASE_SERVICE_ROLE_KEY` pentru a bypassa RLS — acesta e singurul loc din cod unde e permis.

---

## Piețe
- **SUA**: mg/dL, cups/oz/°F, referințe Walmart/Whole Foods/Costco
- **UK**: mmol/L, grams/ml/°C, referințe Tesco/Sainsbury's/ALDI
- **Australia**: mmol/L, grams/ml/°C, referințe Woolworths/Coles/ALDI

---

## Supabase schema
Tabele principale (schema SQL completă în `supabase/schema.sql`):
`users`, `subscriptions`, `quiz_results`, `articles`, `recipes`, `documents` (pgvector), `newsletter_subscribers`

RLS activat pe toate tabelele. `supabase/schema.sql` conține și funcția `match_documents()` pentru RAG.
