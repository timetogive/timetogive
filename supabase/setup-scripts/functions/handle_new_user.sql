-- This trigger automatically creates a profile entry when a new user signs up via Supabase Auth.
-- See https://supabase.com/docs/guides/auth/managing-user-data#using-triggers for more details.
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.geo_tracking (id) values (new.id);
  insert into public.prefs (id) values (new.id);
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data->>'full_name');
  insert into public.tc_agreements (user_id, tc_version) values (new.id, (select latest_tc_version from global_settings));
  -- Don't use the avatar image for now
  -- insert into public.profiles (id, full_name, avatar_url)
  -- values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$ language plpgsql security definer;

