\echo '---------------------------'
\echo 'Setting up reviews'
\echo '---------------------------'

-- auth to profiles setup (copied from standard supabase setup)
-- Create a table for public profiles
create table public.reviews (
  id uuid references auth.users on delete cascade not null primary key,
  from_user_id uuid references public.profiles, -- who is doing the review
  to_user_id uuid references public.profiles, -- who is the reviewee
  to_role reviewee not null default 'Volunteer',
  score smallint not null default 5,
  message text,
  task_id uuid references public.tasks, -- which is this is connection to
  created_datetime TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP not null
);

-- Set up Row Level Security (RLS)
-- See https://supabase.com/docs/guides/auth/row-level-security for more details.

alter table reviews
  enable row level security;

create policy "Reviews are viewable by everyone." on reviews
  for select using (true);

create policy "Reviews can be inserted by the authenticated user." on reviews
  for insert with check (auth.uid() = from_user_id);

-- TODO we need more policies to check that this was actually a volunteer or task lister
