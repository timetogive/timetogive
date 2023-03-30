\echo '---------------------------'
\echo 'Create triggers'
\echo '---------------------------'

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

