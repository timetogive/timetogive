\echo '---------------------------'
\echo 'Setting up profiles'
\echo '---------------------------'

-- auth to profiles setup (copied from standard supabase setup)
-- Create a table for public profiles

create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  updated_at timestamp with time zone,
  full_name text,
  description text,
  avatar_url text,
  public_link1 text,
  public_link2 text,
  public_link3 text,
  has_home boolean default false, -- does the user have a home point for covenience
  home_point geography(Point), -- home point can be a point or a polygon 
  home_point_distance numeric, -- home point radius in meters
  home_point_polygon geography(Polygon) -- home point can be a point or a polygon
);

-- Set up Row Level Security (RLS)
-- See https://supabase.com/docs/guides/auth/row-level-security for more details.
alter table profiles
  enable row level security;

create policy "Public profiles are viewable by everyone." on profiles
  for select using (true);

create policy "Users can insert their own profile." on profiles
  for insert with check (auth.uid() = id);

create policy "Users can update own profile." on profiles
  for update using (auth.uid() = id);

