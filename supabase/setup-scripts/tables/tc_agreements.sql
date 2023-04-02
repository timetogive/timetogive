\echo '---------------------------'
\echo 'Setting up tc_agreements'
\echo '---------------------------'

create table public.tc_agreements (
  user_id uuid references auth.users on delete cascade not null,
  tc_version text,
  created_datetime TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP not null, -- when the ts and cs were agreed to
  PRIMARY KEY(user_id, tc_version)
);

-- Set up Row Level Security (RLS)
-- See https://supabase.com/docs/guides/auth/row-level-security for more details.
alter table tc_agreements
  enable row level security;