# CLAUDE.md — InsulinIQ

## Ce este InsulinIQ
Platformă educațională despre rezistența la insulină, PCOS, NAFLD,
prediabet, obezitate și sindrom metabolic. Piețe: SUA, UK, Australia.
Scop: educație, nu diagnostic. Nicio afirmație medicală fără sursă.

## Stack tehnic — nu devia de la acesta
- Next.js 14 App Router (Server Components by default)
- TypeScript strict mode
- Tailwind CSS + shadcn/ui (nu CSS modules, nu styled-components)
- Supabase (auth + PostgreSQL + pgvector pentru RAG)
- Lemon Squeezy pentru plăți (Merchant of Record)
- Resend pentru emailuri tranzacționale
- Vercel pentru deployment
- Plausible Analytics (nu GA4)

## Reguli de arhitectură
- Server Components by default, Client Components doar dacă e strict necesar
- Toate Supabase calls în Server Components sau Server Actions
- Environment variables în .env.local, niciodată hardcodate
- RLS (Row Level Security) activat pe toate tabelele Supabase
- Mobile-first în toate componentele UI

## Structura folderelor
insuliniq/
├── app/
│   ├── (marketing)/       # homepage, about, landing pages
│   ├── (auth)/            # login, register, forgot-password
│   ├── (dashboard)/       # user dashboard, settings
│   ├── learn/             # enciclopedia educațională
│   ├── pcos/              # hub PCOS
│   ├── prediabetes/       # hub prediabet
│   ├── nafld/             # hub NAFLD/MASLD
│   ├── obesity/           # hub obezitate
│   ├── metabolic-syndrome/
│   ├── recipes/           # biblioteca rețete
│   ├── meal-plans/        # planuri alimentare
│   ├── quiz/              # quiz personalizare
│   ├── ai-assistant/      # AI chat
│   ├── community/         # link spre Circle.so
│   └── legal/             # disclaimer, privacy, terms
├── components/
│   ├── ui/                # shadcn/ui components
│   ├── marketing/         # hero, CTA, feature sections
│   ├── content/           # article card, recipe card, hub card
│   ├── quiz/              # quiz components
│   ├── ai/                # chat interface
│   └── checkout/          # Lemon Squeezy checkout buttons
├── lib/
│   ├── supabase/          # client, server, middleware
│   ├── lemon-squeezy/     # checkout, webhooks, subscriptions
│   ├── resend/            # email templates și sending
│   └── ai/                # RAG pipeline, embeddings
└── content/               # MDX articles (dacă nu folosești Supabase CMS)

## Code style — obligatoriu
- TypeScript strict, fără `any`
- Component names: PascalCase
- Hooks prefix: `use` (ex: useSubscription, useQuizResults)
- Server Actions în fișiere separate `actions/`
- Zod pentru validarea oricărui input de la utilizator
- Error boundaries pe toate paginile cu date dinamice

## Ce NU facem niciodată
- Nu facem afirmații medicale fără sursă citată
- Nu punem promisiuni de tip "vindecă", "inversează garantat"
- Nu stocăm date medicale sensibile fără consimțământ explicit
- Nu folosim `any` în TypeScript
- Nu punem logică de business în componente UI
- Nu facem Client Components dacă Server Components rezolvă problema
- Nu ignorăm RLS pe Supabase

## Disclaimer medical — inclus în orice pagină de conținut
Adaugă automat la finalul oricărui articol, rețetă sau plan alimentar:
"This content is for educational purposes only and does not constitute
medical advice. Always consult a qualified healthcare provider."

## Piețe și adaptări
- SUA: units în cups/oz/°F, referințe Walmart/Whole Foods/Costco
- UK: units în grams/ml/°C, referințe Tesco/Sainsbury's/ALDI
- Australia: units în grams/ml/°C, referințe Woolworths/Coles/ALDI

## Supabase schema — tabele principale
- users (extinde auth.users)
- subscriptions (sync cu Lemon Squeezy webhooks)
- quiz_results (profilul metabolic utilizator)
- articles (dacă CMS în Supabase, nu MDX)
- recipes (biblioteca rețete)
- documents (pgvector pentru RAG AI assistant)

## Lemon Squeezy — produse și prețuri
- plan-14-days: $19 USD / £16 GBP / $29 AUD
- plan-21-days: $34 USD / £28 GBP / $49 AUD
- plan-45-days: $59 USD / £49 GBP / $84 AUD
- subscription-basic: $9/lun USD
- subscription-premium: $19/lun USD
- subscription-community: $24/lun USD

## Deployment
- Vercel (production + preview branches)
- Environment variables setate în Vercel dashboard
- Cloudflare DNS + SSL
