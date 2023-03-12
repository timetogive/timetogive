-- Server side table for persisting user preferences and state

\echo '---------------------------'
\echo 'Setting up prefs'
\echo '---------------------------'

-- User preferences and state

create table public.prefs (
  id uuid references auth.users on delete cascade not null primary key,
  last_search_location json,
  home_search_location json
);

-- Set up Row Level Security (RLS)
-- See https://supabase.com/docs/guides/auth/row-level-security for more details.
alter table prefs
  enable row level security;

create policy "Prefs is private" on prefs
  for select using (auth.uid() = id);

create policy "Users can update own prefs." on prefs
  for update using (auth.uid() = id);



drop policy "Users can update own prefs.";

drop  policy "Prefs is private" on geo_tracking