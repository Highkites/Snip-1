-- Run this in Supabase: Project > SQL Editor > New Query

create table if not exists links (
  id           bigserial primary key,
  platform     text not null,
  alias        text not null,
  original_url text not null,
  created_at   timestamptz default now(),
  unique (platform, alias)
);

-- Allow the anon key to read/insert (since this app has no auth/login).
-- This sets Row Level Security policies open for anon access.
alter table links enable row level security;

create policy "Allow public read" on links
  for select using (true);

create policy "Allow public insert" on links
  for insert with check (true);
