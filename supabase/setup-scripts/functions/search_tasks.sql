create or replace function public.search_tasks(
) returns table (
    id public.tasks.id%type,
    title public.tasks.title%type,
    description public.tasks.description%type,
    reason public.tasks.reason%type,
    listing_longitude double precision,
    listing_latitude double precision,
    created_datetime public.tasks.created_datetime%type
)
language plpgsql
as $$
declare
    select_clause text;
    from_clause text;
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


    order_by_clause := '
        order by t.created_datetime desc
    ';

    final_sql := select_clause||from_clause||order_by_clause;

    return query execute final_sql;

end;
$$;