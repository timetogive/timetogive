\echo '---------------------------'
\echo 'Dropping policies'
\echo '---------------------------'
-- drop policy if exists "Avatar images are publicly accessible." on storage.objects;
-- drop policy if exists "Anyone can upload an avatar." on storage.objects;

\echo '---------------------------'
\echo 'Dropping triggers'
\echo '---------------------------'
-- drop trigger if exists on_auth_user_created on auth.users;

\echo '---------------------------'
\echo 'Dropping functions'
\echo '---------------------------'

-- drop function if exists public.handle_new_user;
drop function if exists public.search_tasks;
drop function if exists public.create_task;
drop function if exists public.create_task_message;

\echo '---------------------------'
\echo 'Dropping tables'
\echo '---------------------------'
-- drop table if exists public.profiles cascade;
-- drop table if exists public.tasks cascade;
drop table if exists public.task_messages cascade;

\echo '---------------------------'
\echo 'Dropping types'
\echo '---------------------------'
-- drop type if exists public.task_status;
-- drop type if exists public.task_reason;

\echo '---------------------------'
\echo 'Dropping buckets (this is a delete)'
\echo '---------------------------'
-- delete from storage.objects where bucket_id = 'avatars';
-- delete from storage.buckets where id = 'avatars';
