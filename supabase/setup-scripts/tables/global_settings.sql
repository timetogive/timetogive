\echo '---------------------------'
\echo 'Setting up global_settings'
\echo '---------------------------'

-- This is a single row table that configures the global settings of the system
create table public.global_settings (
  latest_tc_version text -- the latest version of the terms and conditions (if this changes, the user is forced to re-agree)
);

-- Set up Row Level Security (RLS)
-- See https://supabase.com/docs/guides/auth/row-level-security for more details.
alter table global_settings
  enable row level security;

insert into global_settings (latest_tc_version) values ('1.0');