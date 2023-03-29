\echo '---------------------------'
\echo 'Setting up geo_tracking'
\echo '---------------------------'

-- Create a table for geo_tracking - note this is used for querying in a performant
-- way the tasks that the user should be alerted on. This is not a table for
-- storing user preferences.

create table public.geo_tracking (
  id uuid references auth.users on delete cascade not null primary key,
  home_polygon geography(Polygon) -- home point can be a point or a polygon
);

-- Set up Row Level Security (RLS)
-- See https://supabase.com/docs/guides/auth/row-level-security for more details.
alter table geo_tracking
  enable row level security;

create policy "Geo tracking is private" on geo_tracking
  for select using (auth.uid() = id);

create policy "Users can update own geo_tracking." on geo_tracking
  for update using (auth.uid() = id);





