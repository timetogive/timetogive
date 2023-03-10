-- Search for tasks via a location and radius
drop function public.search_tasks;

create or replace function public.search_tasks(
    p_point_longitude double precision default null,
    p_point_latitude double precision default null,
    p_point_distance double precision default null,
    p_bbox_north_east_longitude double precision default null,
    p_bbox_north_east_latitude double precision default null,
    p_bbox_south_west_longitude double precision default null,
    p_bbox_south_west_latitude double precision default null
) returns table (
    id public.tasks.id%type,
    user_id public.tasks.user_id%type,
    avatar_url public.profiles.avatar_url%type,
    full_name public.profiles.full_name%type,
    title public.tasks.title%type,
    description public.tasks.description%type,
    reason public.tasks.reason%type,
    timing public.tasks.timing%type,
    effort_days public.tasks.effort_days%type,
    effort_hours public.tasks.effort_hours%type,
    effort_minutes public.tasks.effort_minutes%type,
    effort_normalised_minutes public.tasks.effort_normalised_minutes%type,
    effort_people public.tasks.effort_people%type,
    longitude double precision,
    latitude double precision,
    created_datetime public.tasks.created_datetime%type,
    distance double precision
)
language plpgsql
as $$
declare

    select_clause text;
    from_clause text;
    where_clause text;
    order_by_clause text;
	final_sql text;

    l_point_search boolean := false;
    l_bbox_search boolean := false;

begin

    -- You need to pass in point or bbox params
    if p_point_longitude is null and p_bbox_north_east_longitude is null then
        raise exception 'You need to pass in point or bbox params';
    end if;

    -- You can't pass in both point and bbox params, so we run a point based
    -- search if both are passed in
    if (p_point_longitude is not null) then
        l_point_search := true;
    else 
        l_bbox_search := true;
    end if;

    -- We need to build a dynamic sql string, because we don't know what
    -- params are going to be passed
    select_clause := '
        select
          t.id
        , t.user_id
        , p.avatar_url
        , p.full_name
        , t.title
        , t.description
        , t.reason
        , t.timing
        , t.effort_days
        , t.effort_hours
        , t.effort_minutes
        , t.effort_normalised_minutes
        , t.effort_people
        , ST_X(t.fuzzy_geo_location::geometry) as longitude
        , ST_Y(t.fuzzy_geo_location::geometry) as latitude
        , t.created_datetime
        , (ST_Distance(ST_SetSRID(ST_Point($1, $2), 4326)::geography, t.geo_location)) as distance
    ';

    from_clause := '
        from   public.tasks t
        ,      public.profiles p
    ';
    
    where_clause := '
        where t.user_id = p.id
    ';

    if (l_point_search = true) then
        where_clause := where_clause||'
            and ST_DWithin(t.geo_location, ST_SetSRID(ST_Point($1, $2), 4326)::geography, $3)
        ';
    end if;

    if (l_bbox_search = true) then
        where_clause := where_clause||'
            and ST_Intersects(
                t.geo_location,
                ST_MakeEnvelope(
                    $4, $5, $6, $7, 4326
                )::geography
            )
        ';
    end if;

    order_by_clause := '
        order by t.created_datetime desc
    ';

    final_sql := select_clause||from_clause||where_clause||order_by_clause;

    return query
    execute final_sql 
    using p_point_longitude
    ,     p_point_latitude
    ,     p_point_distance
    ,     p_bbox_north_east_longitude
    ,     p_bbox_north_east_latitude
    ,     p_bbox_south_west_longitude
    ,     p_bbox_south_west_latitude;

end;
$$;