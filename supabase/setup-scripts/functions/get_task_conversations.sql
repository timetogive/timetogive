drop function if exists public.get_task_conversations;

-- Search for tasks via a location and radius

create or replace function public.get_task_conversations(
    p_id public.task_messages.task_id%type
) returns table (
    from_user_id uuid,
    from_avatar_url text,
    from_full_name text,
    to_user_id uuid,
    to_avatar_url text,
    to_full_name text,
    total_count bigint,
    unread_count bigint
)
language plpgsql
as $$
declare
    l_auth_user_id public.task_messages.from_user_id%type;
begin

    -- Set user id to current authenticated user
    l_auth_user_id := auth.uid();

    return query 
    select tm.from_user_id as from_user_id
    ,      pf.avatar_url as from_avatar_url
    ,      pf.full_name as from_full_name
    ,      tm.to_user_id as to_user_id
    ,      pt.avatar_url as to_avatar_url
    ,      pt.full_name as to_full_name
    ,      count(*) as total_count
    ,      sum(case when (tm.to_user_id = l_auth_user_id and tm.is_read = false) then 1 else 0 end) AS unread_count
    from task_messages tm
    ,    profiles pf
    ,    profiles pt
    where tm.task_id = p_id
    and   tm.from_user_id = pf.id
    and   tm.to_user_id = pt.id
    and  (tm.from_user_id = l_auth_user_id or tm.to_user_id = l_auth_user_id)
    group by 
        tm.from_user_id
    ,   pf.avatar_url
    ,   pf.full_name
    ,   tm.to_user_id
    ,   pt.avatar_url
    ,   pt.full_name;

end;
$$;