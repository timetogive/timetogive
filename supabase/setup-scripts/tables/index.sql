\echo '---------------------------'
\echo 'Dropping policies'
\echo '---------------------------'
drop policy if exists "Avatar images are publicly accessible." on storage.objects;
drop policy if exists "Anyone can upload an avatar." on storage.objects;

\echo '---------------------------'
\echo 'Dropping triggers'
\echo '---------------------------'
drop trigger on_auth_user_created on auth.users;

\echo '---------------------------'
\echo 'Dropping functions'
\echo '---------------------------'
drop function public.handle_new_user();

\echo '---------------------------'
\echo 'Dropping tables'
\echo '---------------------------'
--drop table if exists public.profiles cascade;
drop table if exists public.tasks cascade;

\echo '---------------------------'
\echo 'Dropping types'
\echo '---------------------------'
drop type if exists public.task_status;
drop type if exists public.task_estimate_units;
drop type if exists public.task_timing;

\echo '---------------------------'
\echo 'Dropping buckets'
\echo '---------------------------'
delete from storage.objects where bucket_id = 'avatars';
delete from storage.buckets where id = 'avatars';

--\ir profiles.sql
\ir storage.sql
\ir tasks.sql
