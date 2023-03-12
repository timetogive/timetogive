\echo '---------------------------'
\echo 'Setting up geo_tracking'
\echo '---------------------------'

-- Create a table for geo_tracking

create table public.geo_tracking (
  id uuid references auth.users on delete cascade not null primary key,
  has_home boolean default false, -- does the user have a home point for covenience
  home_point geography(Point), -- home point can be a point or a polygon 
  home_point_distance numeric, -- home point radius in meters
  home_point_polygon geography(Polygon), -- home point can be a point or a polygon
  has_last_search boolean default false, -- does the user have a last search for covenience
  last_search_point geography(Point), -- last search can be a point or a polygon 
  last_search_point_distance numeric, -- last search radius in meters
  last_search_point_polygon geography(Polygon) -- last search can be a point or a polygon
);

-- Set up Row Level Security (RLS)
-- See https://supabase.com/docs/guides/auth/row-level-security for more details.
alter table geo_tracking
  enable row level security;

create policy "Geo tracking is private" on geo_tracking
  for select using (auth.uid() = id);

create policy "Users can insert their own geo_tracking." on geo_tracking
  for insert with check (auth.uid() = id);

create policy "Users can update own geo_tracking." on geo_tracking
  for update using (auth.uid() = id);

