-- Run once in the Supabase dashboard: SQL Editor > New query > paste > Run.
-- One row per signed-in student, holding their profile, saved items and progress.
create table if not exists public.user_data (
  user_id uuid primary key references auth.users (id) on delete cascade,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.user_data enable row level security;

-- Students can only see and change their own row.
create policy "Read own data" on public.user_data
  for select to authenticated using (auth.uid() = user_id);
create policy "Insert own data" on public.user_data
  for insert to authenticated with check (auth.uid() = user_id);
create policy "Update own data" on public.user_data
  for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- "Automatically expose new tables" was turned off, so grant access explicitly.
grant select, insert, update on public.user_data to authenticated;

-- Part 2: save counts for the "Popular" tab. Run this once too.
-- Totals only: the view never shows which student saved what. It runs with the table owner's
-- rights so it can count across students; the site only lists items with at least 3 saves.
create or replace view public.save_counts as
select item_id, count(*)::int as saves
from public.user_data,
  lateral jsonb_array_elements_text(
    case when jsonb_typeof(data -> 'savedResourceIds') = 'array'
         then data -> 'savedResourceIds' else '[]'::jsonb end
  ) as item_id
group by item_id;

grant select on public.save_counts to anon, authenticated;
