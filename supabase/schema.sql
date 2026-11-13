-- TrendRadar Supabase Database Schema
-- Provides tables for trends, watchlists, saved trends, followed keywords, and user preferences

-- 1. Enable UUID extension
create extension if not exists "uuid-ossp";

-- 2. Trends Table
create table if not exists public.trends (
  id text primary key,
  title text not null,
  bengali_title text,
  description text not null,
  category text not null,
  platform text not null,
  region text not null,
  popularity_score numeric not null default 50,
  growth_rate numeric not null default 0,
  volume_formatted text not null,
  raw_volume bigint default 0,
  first_detected timestamp with time zone default timezone('utc'::text, now()),
  url text not null,
  author text,
  source_type text not null default 'PUBLIC_FEED',
  tags text[] default array[]::text[],
  keywords text[] default array[]::text[],
  sentiment text default 'neutral',
  history jsonb default '[]'::jsonb,
  platform_breakdown jsonb default '[]'::jsonb,
  region_breakdown jsonb default '[]'::jsonb,
  ai_summary jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 3. Watchlists Table
create table if not exists public.watchlists (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade,
  name text not null,
  description text default '',
  keywords text[] default array[]::text[],
  tags text[] default array[]::text[],
  color text default '#2563eb',
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 4. Saved Trends (Bookmarks)
create table if not exists public.saved_trends (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade,
  trend_id text not null,
  watchlist_id uuid references public.watchlists(id) on delete set null,
  notes text,
  saved_at timestamp with time zone default timezone('utc'::text, now()),
  unique(user_id, trend_id)
);

-- 5. User Preferences
create table if not exists public.user_preferences (
  user_id uuid primary key references auth.users(id) on delete cascade,
  preferred_region text default 'BD',
  preferred_categories text[] default array['bangladesh', 'technology', 'sports']::text[],
  preferred_platforms text[] default array['youtube', 'reddit', 'googletrends', 'facebook']::text[],
  theme text default 'light',
  notify_on_spikes boolean default true,
  spike_threshold integer default 75,
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- Enable Row Level Security (RLS)
alter table public.trends enable row level security;
alter table public.watchlists enable row level security;
alter table public.saved_trends enable row level security;
alter table public.user_preferences enable row level security;

-- Policies for public reading of trends
create policy "Trends are viewable by everyone" on public.trends
  for select using (true);

-- Policies for user watchlists
create policy "Users can view their own watchlists" on public.watchlists
  for select using (auth.uid() = user_id);

create policy "Users can insert their own watchlists" on public.watchlists
  for insert with check (auth.uid() = user_id);

create policy "Users can update their own watchlists" on public.watchlists
  for update using (auth.uid() = user_id);

create policy "Users can delete their own watchlists" on public.watchlists
  for delete using (auth.uid() = user_id);

-- Policies for saved trends
create policy "Users can view their saved trends" on public.saved_trends
  for select using (auth.uid() = user_id);

create policy "Users can save trends" on public.saved_trends
  for insert with check (auth.uid() = user_id);

create policy "Users can delete saved trends" on public.saved_trends
  for delete using (auth.uid() = user_id);
