
\echo '---------------------------'
\echo 'Setting up task_offers'
\echo '---------------------------'

CREATE TYPE public.task_offer_status AS ENUM (
   'Pending', 
   'Accepted',
   'Declined'
);

create table public.task_offers(
   id uuid not null primary key default uuid_generate_v4(),
   task_id uuid references public.tasks not null, -- references a specific task
   from_user_id uuid references public.profiles not null, -- who sent the message
   status task_status not null default 'Pending',
   created_datetime TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP not null -- when the offer was made
);

-- Set up Row Level Security (RLS)
-- See https://supabase.com/docs/guides/auth/row-level-security for more details.
alter table public.task_offers
  enable row level security;

create policy "Users can only access messages they are involved in."
    on public.task_offers for select
    using ( auth.uid() = from_user_id);
