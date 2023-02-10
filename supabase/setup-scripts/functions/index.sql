\echo '---------------------------'
\echo 'Dropping functions'
\echo '---------------------------'

drop function if exists public.search_tasks;

\ir search_tasks.sql
