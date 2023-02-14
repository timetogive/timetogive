-- Search for tasks via a location and radius

create or replace function public.search_tasks(
    p_longitude double precision,
    p_latitude double precision,
    p_distance double precision
) returns table (
    id public.tasks.id%type,
    title public.tasks.title%type,
    description public.tasks.description%type,
    reason public.tasks.reason%type,
    longitude double precision,
    latitude double precision,
    created_datetime public.tasks.created_datetime%type
)
language plpgsql
as $$
declare
    select_clause text;
    from_clause text;
    where_clause text;
    order_by_clause text;
	final_sql text;

begin

    -- We need to build a dynamic sql string, because we don't know what
    -- params are going to be passed
    select_clause := '
        select
          t.id
        , t.title
        , t.description
        , t.reason
        , ST_X(t.fuzzy_geo_location::geometry) as longitude
        , ST_Y(t.fuzzy_geo_location::geometry) as latitude
        , t.created_datetime
    ';

    from_clause := '
        from   public.tasks t
    ';
    
    where_clause := 'where ST_DWithin(t.geo_location, ST_SetSRID(ST_Point($1, $2), 4326)::geography, $3)';

    order_by_clause := '
        order by t.created_datetime desc
    ';

    final_sql := select_clause||from_clause||where_clause||order_by_clause;

    return query execute final_sql using p_longitude, p_latitude, p_distance;

end;
$$;