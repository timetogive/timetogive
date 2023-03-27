-- Server side table for persisting push tokens so that
-- the server side can send push notifications to users.

\echo '---------------------------'
\echo 'Setting up push_tokens'
\echo '---------------------------'

drop table push_tokens;

-- User preferences and state

create table public.push_tokens (
  user_id uuid references auth.users on delete cascade not null,
  push_token text,
  PRIMARY KEY(user_id, push_token)
);

-- Set up Row Level Security (RLS)
-- See https://supabase.com/docs/guides/auth/row-level-security for more details.
alter table push_tokens
  enable row level security;

create policy "Push tokens is private" on push_tokens
  for select using (auth.uid() = user_id);

create policy "Users can update own push tokens." on push_tokens
  for update using (auth.uid() = user_id);

create policy "Users can insert own push tokens." on push_tokens
  for insert with check (auth.uid() = user_id);

create policy "Users can delete own push tokens." on push_tokens
  for delete using (auth.uid() = user_id);


