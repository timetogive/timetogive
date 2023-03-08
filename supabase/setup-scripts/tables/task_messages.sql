
\echo '---------------------------'
\echo 'Setting up task_messages'
\echo '---------------------------'

create table public.task_messages(
   id uuid not null primary key default uuid_generate_v4(),
   task_id uuid references public.tasks not null, -- references a specific task
   from_user_id uuid references public.profiles not null, -- who sent the message
   to_user_id uuid references public.profiles not null, -- who received the message
   is_read boolean not null default false, -- has the message been read
   message_text text not null, -- the message
   created_datetime TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP not null -- when the task was created
);

-- Set up Row Level Security (RLS)
-- See https://supabase.com/docs/guides/auth/row-level-security for more details.
alter table public.task_messages
  enable row level security;

create policy "Users can only access messages they are involved in."
    on public.task_messages for select
    using ( auth.uid() = from_user_id or auth.uid() = to_user_id );
