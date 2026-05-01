create extension if not exists "pgcrypto";

create table if not exists public.questions (
  id uuid primary key default gen_random_uuid(),
  category text not null,
  question_type text not null check (question_type in ('text','image','news')),
  content text not null,
  image_url text,
  headline text,
  excerpt text,
  source_name text,
  source_url text,
  active_date date,
  answer text not null check (answer in ('real','fake')),
  explanation text not null,
  difficulty text not null check (difficulty in ('easy','medium','hard')),
  is_published boolean not null default false,
  is_in_daily_pool boolean not null default true,
  is_in_hardcore_pool boolean not null default false,
  is_in_online_pool boolean not null default false,
  tags text[] not null default '{}',
  usage_count integer not null default 0,
  archived boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.questions
  add column if not exists is_in_daily_pool boolean not null default true,
  add column if not exists is_in_hardcore_pool boolean not null default false,
  add column if not exists is_in_online_pool boolean not null default false,
  add column if not exists tags text[] not null default '{}',
  add column if not exists usage_count integer not null default 0,
  add column if not exists archived boolean not null default false;

alter table public.questions enable row level security;

drop policy if exists "public read published" on public.questions;
drop policy if exists "no public insert" on public.questions;
drop policy if exists "no public update" on public.questions;
drop policy if exists "no public delete" on public.questions;

create policy "public read published" on public.questions for select to anon, authenticated using (is_published = true);
create policy "no public insert" on public.questions for insert to anon, authenticated with check (false);
create policy "no public update" on public.questions for update to anon, authenticated using (false);
create policy "no public delete" on public.questions for delete to anon, authenticated using (false);

create table if not exists public.question_candidates (
  id uuid primary key default gen_random_uuid(),
  source_name text,
  source_url text,
  raw_title text,
  raw_summary text,
  suggested_category text,
  suggested_question_type text check (suggested_question_type in ('text','image','news')),
  suggested_content text,
  suggested_headline text,
  suggested_excerpt text,
  suggested_answer text check (suggested_answer in ('real','fake')),
  suggested_explanation text,
  suggested_difficulty text check (suggested_difficulty in ('easy','medium','hard')),
  suggested_tags text[] not null default '{}',
  suggested_image_prompt text,
  status text not null default 'pending' check (status in ('pending','approved','rejected')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.question_candidates enable row level security;

drop policy if exists "no public select question candidates" on public.question_candidates;
drop policy if exists "no public insert question candidates" on public.question_candidates;
drop policy if exists "no public update question candidates" on public.question_candidates;
drop policy if exists "no public delete question candidates" on public.question_candidates;

create policy "no public select question candidates" on public.question_candidates for select to anon, authenticated using (false);
create policy "no public insert question candidates" on public.question_candidates for insert to anon, authenticated with check (false);
create policy "no public update question candidates" on public.question_candidates for update to anon, authenticated using (false);
create policy "no public delete question candidates" on public.question_candidates for delete to anon, authenticated using (false);

insert into storage.buckets (id, name, public) values ('question-images', 'question-images', true) on conflict (id) do nothing;
