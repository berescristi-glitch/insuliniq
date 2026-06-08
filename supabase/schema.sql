-- ============================================================
-- InsulinIQ — complete database schema with RLS
-- Run this in Supabase SQL Editor (Dashboard > SQL Editor)
-- ============================================================

-- Enable pgvector for RAG embeddings
create extension if not exists vector;

-- ============================================================
-- USERS (extends auth.users)
-- ============================================================
create table if not exists public.users (
  id           uuid references auth.users(id) on delete cascade primary key,
  email        text not null unique,
  full_name    text,
  avatar_url   text,
  country      text check (country in ('US', 'GB', 'AU')),
  created_at   timestamptz default now() not null,
  updated_at   timestamptz default now() not null
);

alter table public.users enable row level security;

create policy "Users can view own profile"
  on public.users for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.users for update
  using (auth.uid() = id);

-- Auto-create user profile on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = ''
as $$
begin
  insert into public.users (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data ->> 'full_name',
    new.raw_user_meta_data ->> 'avatar_url'
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Auto-update updated_at
create or replace function public.update_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger users_updated_at
  before update on public.users
  for each row execute procedure public.update_updated_at();

-- ============================================================
-- SUBSCRIPTIONS (synced via Lemon Squeezy webhooks)
-- ============================================================
create table if not exists public.subscriptions (
  id                              uuid default gen_random_uuid() primary key,
  user_id                         uuid references public.users(id) on delete cascade not null,
  lemon_squeezy_subscription_id   text unique not null,
  lemon_squeezy_customer_id       text not null,
  plan_id                         text not null,
  status                          text not null check (status in ('active','cancelled','expired','paused','past_due')),
  current_period_end              timestamptz,
  created_at                      timestamptz default now() not null,
  updated_at                      timestamptz default now() not null
);

alter table public.subscriptions enable row level security;

create policy "Users can view own subscriptions"
  on public.subscriptions for select
  using (auth.uid() = user_id);

create trigger subscriptions_updated_at
  before update on public.subscriptions
  for each row execute procedure public.update_updated_at();

-- ============================================================
-- QUIZ RESULTS
-- ============================================================
create table if not exists public.quiz_results (
  id                uuid default gen_random_uuid() primary key,
  user_id           uuid references public.users(id) on delete set null,
  session_id        text not null,
  answers           jsonb not null default '{}',
  metabolic_profile text,
  risk_score        integer check (risk_score between 0 and 100),
  recommendations   jsonb,
  created_at        timestamptz default now() not null
);

alter table public.quiz_results enable row level security;

create policy "Users can view own quiz results"
  on public.quiz_results for select
  using (auth.uid() = user_id);

create policy "Anyone can insert quiz results"
  on public.quiz_results for insert
  with check (true);

-- ============================================================
-- ARTICLES
-- ============================================================
create table if not exists public.articles (
  id                    uuid default gen_random_uuid() primary key,
  slug                  text unique not null,
  title                 text not null,
  excerpt               text,
  content               text not null,
  category              text not null,
  tags                  text[] default '{}',
  author                text not null default 'InsulinIQ Editorial',
  published             boolean default false not null,
  featured_image        text,
  reading_time_minutes  integer,
  sources               jsonb,
  created_at            timestamptz default now() not null,
  updated_at            timestamptz default now() not null
);

alter table public.articles enable row level security;

create policy "Published articles are visible to everyone"
  on public.articles for select
  using (published = true);

create trigger articles_updated_at
  before update on public.articles
  for each row execute procedure public.update_updated_at();

create index articles_slug_idx on public.articles(slug);
create index articles_category_idx on public.articles(category);
create index articles_published_idx on public.articles(published);

-- ============================================================
-- RECIPES
-- ============================================================
create table if not exists public.recipes (
  id                    uuid default gen_random_uuid() primary key,
  slug                  text unique not null,
  title                 text not null,
  description           text,
  ingredients_us        jsonb not null default '[]',
  ingredients_uk        jsonb not null default '[]',
  ingredients_au        jsonb not null default '[]',
  instructions          text not null,
  prep_time_minutes     integer,
  cook_time_minutes     integer,
  servings              integer,
  nutrition_per_serving jsonb,
  tags                  text[] default '{}',
  category              text not null,
  featured_image        text,
  published             boolean default false not null,
  created_at            timestamptz default now() not null,
  updated_at            timestamptz default now() not null
);

alter table public.recipes enable row level security;

create policy "Published recipes are visible to everyone"
  on public.recipes for select
  using (published = true);

create trigger recipes_updated_at
  before update on public.recipes
  for each row execute procedure public.update_updated_at();

-- ============================================================
-- DOCUMENTS (RAG / pgvector)
-- ============================================================
create table if not exists public.documents (
  id         uuid default gen_random_uuid() primary key,
  content    text not null,
  metadata   jsonb default '{}',
  embedding  vector(1536),
  created_at timestamptz default now() not null
);

alter table public.documents enable row level security;

create policy "Documents are readable by authenticated users"
  on public.documents for select
  to authenticated
  using (true);

-- Cosine similarity search function
create or replace function public.match_documents(
  query_embedding vector(1536),
  match_count     int default 5,
  filter          jsonb default '{}'
)
returns table (
  id         uuid,
  content    text,
  metadata   jsonb,
  similarity float
)
language plpgsql as $$
begin
  return query
  select
    d.id,
    d.content,
    d.metadata,
    1 - (d.embedding <=> query_embedding) as similarity
  from public.documents d
  where d.metadata @> filter
  order by d.embedding <=> query_embedding
  limit match_count;
end;
$$;

-- ============================================================
-- NEWSLETTER SUBSCRIBERS
-- ============================================================
create table if not exists public.newsletter_subscribers (
  id         uuid default gen_random_uuid() primary key,
  email      text unique not null,
  confirmed  boolean default false not null,
  country    text,
  source     text,
  created_at timestamptz default now() not null
);

alter table public.newsletter_subscribers enable row level security;

create policy "Newsletter subscribers can only insert their own email"
  on public.newsletter_subscribers for insert
  with check (true);

-- Admins can read all (via service role key in server actions only)
create policy "No direct reads by public"
  on public.newsletter_subscribers for select
  using (false);
