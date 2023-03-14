drop function if exists public.get_task_offers;

-- Get task offers

create or replace function public.get_task_offers(
    p_task_id public.task_offers.task_id%type
) returns table (
    id public.task_offers.id%type,
    user_id public.task_offers.user_id%type,
    avatar_url public.profiles.avatar_url%type,
    full_name public.profiles.full_name%type,
    status public.task_offers.status%type,
    created_datetime public.task_offers.created_datetime%type,
    processed_datetime public.task_offers.processed_datetime%type
)
language plpgsql
as $$
declare
    l_auth_user_id public.task_messages.from_user_id%type;
    l_task_owner_id public.tasks.user_id%type;
    l_is_owner boolean := false;
begin

    -- Set user id to current authenticated user
    l_auth_user_id := auth.uid();

    -- If the user is the owner then return all offers
    -- If the user is not the owner then return only their offer
    -- get the owner of the task
    select t.user_id
    into   l_task_owner_id
    from   public.tasks t
    where  t.id = p_task_id;

    if (l_task_owner_id = l_auth_user_id) then
      l_is_owner = true;
    end if;
    
    return query
    select tof.id as id
    ,      tof.user_id as user_id
    ,      p.avatar_url as avatar_url
    ,      p.full_name as full_name
    ,      tof.status as status
    ,      tof.created_datetime as created_datetime
    ,      tof.processed_datetime as processed_datetime
    from   task_offers tof
    ,      profiles p
    where  tof.task_id = p_task_id
    and    tof.user_id = p.id
    and    (l_is_owner = true or tof.user_id = l_auth_user_id)
    order  by tof.created_datetime desc;

end;
$$;