drop function if exists public.get_task;

drop type public.task_full_info;

create type public.task_full_info as (
   id uuid,
   user_id uuid,
   status task_status,
   reason task_reason,
   will_pledge boolean,
   pledge text,
   title text,
   description text,
   effort_days integer,
   effort_hours integer,
   effort_minutes integer,
   effort_normalised_minutes integer,
   effort_people int ,
   timing text,
   remote boolean ,
   longitude double precision,
   latitude double precision,
   created_datetime TIMESTAMP,
   distance double precision,
   user_full_name text,
   user_avatar_url text
);

create or replace function public.get_task(
    p_id public.tasks.id%type,
    p_longitude double precision default null,
    p_latitude double precision  default null
)
returns task_full_info
language plpgsql
as $$
declare
    select_clause text;
    from_clause text;
    where_clause text;
	final_sql text;
    rec task_full_info;
begin

    select_clause := '
        select 
          t.id
        , t.user_id
        , t.status
        , t.reason
        , t.will_pledge
        , t.pledge
        , t.title
        , t.description
        , t.effort_days
        , t.effort_hours
        , t.effort_minutes
        , t.effort_normalised_minutes
        , t.effort_people
        , t.timing
        , t.remote
        , ST_X(t.fuzzy_geo_location::geometry) as longitude
        , ST_Y(t.fuzzy_geo_location::geometry) as latitude
        , t.created_datetime
    ';

    if (p_longitude is not null and p_latitude is not null) then
      select_clause := select_clause||'
        , (ST_Distance(ST_SetSRID(ST_Point($1, $2), 4326)::geography, t.geo_location)) as distance
      ';
    else 
      select_clause := select_clause||'
        , 0 as distance
      ';
    end if;

    select_clause := select_clause||'
        , p.full_name
        , p.avatar_url
    ';

    from_clause := '
        from   public.tasks t
        ,      public.profiles p
    ';
    
    where_clause := '
        where t.id = $3
        and t.user_id = p.id
    ';

    final_sql := select_clause||from_clause||where_clause;

    execute final_sql into rec using p_longitude, p_latitude, p_id;

    return rec;

end;
$$;