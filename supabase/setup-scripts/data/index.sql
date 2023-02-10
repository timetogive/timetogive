delete from tasks;

insert into tasks (
   user_id,
   title,
   description,
   reason,
   will_pledge,
   pledge,
   effort_estimate,
   effort_estimate_units,
   effort_estimate_in_minutes,
   people_estimate,
   timing,
   geo_location,
   fuzzy_geo_location,
   remote
) values (
    '1cd59cd3-5c30-4e11-9a4d-dc7e939ac866',
    'Fix Wi-Fi for elderly person in Asheridge',
    'Tech savvy person needed to help fix or reboot wifi',
   'In Need',
    false,
    null,
    20,
    'Minutes',
    20,
    1,
    'Any Time',
    'POINT(-0.6463291295679374 51.73398480387516)',
    'POINT(-0.6463291295679374 51.73398480387516)',
    false
)