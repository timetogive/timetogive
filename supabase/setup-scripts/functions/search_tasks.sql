-- Search for tasks via a location and radius
drop function public.search_tasks;

create or replace function public.search_tasks(
    p_current_point json default null, -- to get distances back you can pass in the current point (might be same as p_point_json)
    p_point_json json default null, -- if searching from a point
    p_point_distance double precision default null, -- radius of the point
    p_polygon_json json default null -- if searching from a polygon
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
    l_polygon_search boolean := false;

    l_current_point_as_geography geography;
    l_point_as_geography geography;
    l_polygon_as_geography geography;


begin

    -- You need to pass in point or polygon params
    if p_point_json is null and p_point_distance is null and p_polygon_json is null then
        raise exception 'You need to pass in point or polygon params';
    end if;

    if p_point_json is not null and p_point_distance is null then
        raise exception 'You need to pass in distance when using passing in point';
    end if;

    -- You can't pass in both point and polygon params, so we run a point based
    -- search if both are passed in
    if (p_point_json is not null) then
        l_point_search := true;
        l_point_as_geography := ST_GeomFromGeoJSON(p_point_json)::geography;
    else 
        l_polygon_search := true;
        l_polygon_as_geography := ST_GeomFromGeoJSON(p_polygon_json)::geography;
    end if;

    if (p_current_point is not null) then
        l_current_point_as_geography := ST_GeomFromGeoJSON(p_current_point)::geography;
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
    ';

    if (p_current_point is not null) then
        select_clause := select_clause||'
            , ST_Distance(t.geo_location, $1) as distance
        ';
    else 
        select_clause := select_clause||'
            , 0 as distance
        ';
    end if;

    from_clause := '
        from   public.tasks t
        ,      public.profiles p
    ';
    
    where_clause := '
        where t.user_id = p.id
    ';

    if (l_point_search = true) then
        where_clause := where_clause||'
            and ST_DWithin(t.geo_location, $2, $3)
        ';
    end if;

    if (l_polygon_search = true) then
        where_clause := where_clause||'
            and ST_Intersects(
                t.geo_location,
                $4
            )
        ';
    end if;

    order_by_clause := '
        order by t.created_datetime desc
    ';

    final_sql := select_clause||from_clause||where_clause||order_by_clause;

    return query
    execute final_sql 
    using l_current_point_as_geography, l_point_as_geography, p_point_distance, l_polygon_as_geography;
end;
$$;