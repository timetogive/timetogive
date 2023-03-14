create or replace function public.create_task(
   reason public.tasks.reason%type,
   will_pledge public.tasks.will_pledge%type,
   title public.tasks.title%type,
   description public.tasks.description%type,
   effort_days public.tasks.effort_days%type,
   effort_hours public.tasks.effort_hours%type,
   effort_minutes public.tasks.effort_minutes%type,
   effort_people public.tasks.effort_people%type,
   timing public.tasks.timing%type,
   remote public.tasks.remote%type,
   longitude numeric(10,6),
   latitude numeric(10,6),
   lifespan_days public.tasks.lifespan_days%type,
   pledge public.tasks.pledge%type default null
)
returns public.tasks.id%type
language plpgsql
as $$
declare
    /*
     * This is an RPC function for allowing the user to create a task
     */
    return_id public.tasks.id%type;
    geo_location public.tasks.geo_location%type;
    circle_around_geo_location geometry;
    random_multipoint geometry;
    fuzzy_geo_location public.tasks.fuzzy_geo_location%type;
    user_id public.tasks.user_id%type;
    status public.tasks.status%type;
    effort_normalised_minutes public.tasks.effort_normalised_minutes%type;
begin

    -- Set user id to current authenticated user
    user_id := auth.uid();
    -- Live by default
    status := 'Live';
    -- Calculate the normalised minutes
    effort_normalised_minutes := (effort_days * 1440) + (effort_hours * 60) + effort_minutes;
    -- Convert the lat/long to a geo_location
    geo_location := ST_SetSRID(ST_MakePoint(longitude, latitude), 4326);
    -- Create a fuzzy location from the actual location (500 is metres)
    circle_around_geo_location := ST_Buffer(geo_location, 500, 'quad_segs=8');
    -- Generate random points (but just one) from within that circle (1996 is a just a seed value)
    random_multipoint := ST_GeneratePoints(circle_around_geo_location, 1, 1996);
    -- Get the first point from the set of 1 points
    fuzzy_geo_location := ST_GeometryN(random_multipoint, 1);

    -- Do the insert
    insert into tasks(
        user_id,
        reason,
        will_pledge,
        pledge,
        title,
        description,
        effort_days,
        effort_hours,
        effort_minutes,
        effort_normalised_minutes,
        effort_people,
        timing,
        remote,
        geo_location,
        fuzzy_geo_location,
        lifespan_days
    ) values (
        user_id,
        reason,
        will_pledge,
        pledge,
        title,
        description,
        effort_days,
        effort_hours,
        effort_minutes,
        effort_normalised_minutes,
        effort_people,
        timing,
        remote,
        geo_location,
        fuzzy_geo_location,
        lifespan_days
    ) returning id into return_id;

    -- Return the id of the new task
    return return_id;
end;
$$ security definer;

