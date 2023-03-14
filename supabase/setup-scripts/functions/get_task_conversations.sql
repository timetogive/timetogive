drop function if exists public.get_task_conversations;

-- Search for tasks via a location and radius

create or replace function public.get_task_conversations(
    p_id public.task_messages.task_id%type
) returns table (
    user_id uuid,
    avatar_url text,
    full_name text,
    my_unread_count bigint
)
language plpgsql
as $$
declare
    l_auth_user_id public.task_messages.from_user_id%type;
begin

    -- Set user id to current authenticated user
    l_auth_user_id := auth.uid();
    return query
    select cons.user_id as user_id
    ,      cons.avatar_url as avatar_url
    ,      cons.full_name as full_name
    ,      sum(cons.my_unread_count)::bigint as my_unread_count
    from (
        select tm.from_user_id as user_id
        ,      p.avatar_url as avatar_url
        ,      p.full_name as full_name
        ,      sum(case when (tm.to_user_id = l_auth_user_id and tm.is_read = false) then 1 else 0 end) AS my_unread_count
        from   task_messages tm
        ,      profiles p
        where  tm.task_id = p_id
        and    tm.from_user_id = p.id
        and    tm.to_user_id = l_auth_user_id
        group by tm.from_user_id, p.avatar_url, p.full_name
        union 
        select tm.to_user_id as user_id
        ,      p.avatar_url as avatar_url
        ,      p.full_name as full_name
        ,      sum(0) AS my_unread_count
        from   task_messages tm
        ,      profiles p
        where  tm.task_id = p_id
        and    tm.to_user_id = p.id
        and    tm.from_user_id = l_auth_user_id
        group by tm.to_user_id, p.avatar_url, p.full_name
    ) as cons group by cons.user_id, cons.avatar_url, cons.full_name;

end;
$$;