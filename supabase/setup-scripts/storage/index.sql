\echo '---------------------------'
\echo 'Setting up storage'
\echo '---------------------------'

-- Set up Storage!
insert into storage.buckets (id, name, public)
  values ('avatars', 'avatars', true);

-- Set up access controls for storage.
-- See https://supabase.com/docs/guides/storage#policy-examples for more details.
create policy "Avatar images are publicly accessible." on storage.objects
 for select using (bucket_id = 'avatars');

create policy "Anyone can upload an avatar." on storage.objects
 for insert with check (bucket_id = 'avatars');