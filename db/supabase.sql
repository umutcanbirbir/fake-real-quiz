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
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.questions enable row level security;

drop policy if exists "public read published" on public.questions;
drop policy if exists "no public insert" on public.questions;
drop policy if exists "no public update" on public.questions;
drop policy if exists "no public delete" on public.questions;

create policy "public read published" on public.questions for select to anon, authenticated using (is_published = true);
create policy "no public insert" on public.questions for insert to anon, authenticated with check (false);
create policy "no public update" on public.questions for update to anon, authenticated using (false);
create policy "no public delete" on public.questions for delete to anon, authenticated using (false);

insert into storage.buckets (id, name, public) values ('question-images', 'question-images', true) on conflict (id) do nothing;
