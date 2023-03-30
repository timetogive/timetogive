\echo '---------------------------'
\echo 'Drop realtime'
\echo '---------------------------'

begin;
  -- remove the supabase_realtime publication
  drop publication if exists supabase_realtime;

commit;
