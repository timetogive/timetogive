
\echo '---------------------------'
\echo 'Setting up task_offers'
\echo '---------------------------'

drop table task_offers;

drop type task_offer_status;

CREATE TYPE public.task_offer_status AS ENUM (
   'Pending',
   'Accepted',
   'Declined',
   'Cancelled'
);

create table public.task_offers(
   id uuid not null primary key default uuid_generate_v4(),
   user_id uuid references public.profiles not null, -- who sent the offer
   task_id uuid references public.tasks not null, -- references a specific task
   task_owner_id uuid references public.profiles not null, -- who owns the task (denormalised for convenience)
   status task_offer_status not null default 'Pending',
   created_datetime TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP not null, -- when the offer was made
   processed_datetime TIMESTAMP WITH TIME ZONE -- when the offer was processed (to accepted to declined)
);

CREATE UNIQUE INDEX task_offers_limits ON public.task_offers (user_id, task_id, status)
    WHERE status = 'Pending' or status = 'Accepted';

-- Set up Row Level Security (RLS)
-- See https://supabase.com/docs/guides/auth/row-level-security for more details.
alter table public.task_offers
  enable row level security;

create policy "Users can only access their own task offers"
    on public.task_offers for select
    using ( auth.uid() = user_id or auth.uid() = task_owner_id );
