
\echo '---------------------------'
\echo 'Setting up notifications'
\echo '---------------------------'


CREATE TYPE public.notifications_item_type AS ENUM (
    'Task',
    'TaskOffer',
    'TaskOfferAccepted',
    'TaskOfferDeclined',
    'TaskOfferCancelled',
    'TaskMessage'
);

create table public.notifications(
   id uuid not null primary key default uuid_generate_v4(), 
   user_id uuid references public.profiles not null, -- who the notifications is for
   you_actioned boolean not null default false, -- did you take the action that caused the notifications item to be created
   type notifications_item_type not null, -- the type of notifications item
   payload jsonb not null, -- the payload
   created_datetime TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP not null -- when the task was created
);

-- Set up Row Level Security (RLS)
-- See https://supabase.com/docs/guides/auth/row-level-security for more details.
alter table public.notifications
  enable row level security;

create policy "Users can only access their own notifications items."
    on public.notifications for select
    using ( auth.uid() = user_id );
