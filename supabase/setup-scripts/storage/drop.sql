\echo '---------------------------'
\echo 'Drop storage'
\echo '---------------------------'

delete from storage.objects where bucket_id = 'avatars';

delete from storage.buckets where id = 'avatars';

drop policy "Avatar images are publicly accessible." on storage.objects;
 
drop policy "Anyone can upload an avatar." on storage.objects;