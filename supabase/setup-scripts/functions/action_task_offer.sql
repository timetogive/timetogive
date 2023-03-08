create or replace function public.action_task_offer(
   p_task_offer_id public.task_offers.id%type,
   p_status public.task_offers.status%type
)
returns public.task_offers.id%type
language plpgsql
as $$
declare
    /*
     * Sets the status of a task offer
     */
    l_user_id public.profiles.id%type;
    l_task_status public.tasks.status%type;
    l_task_effort_people public.tasks.effort_people%type;
    l_task_offer_status public.task_offers.status%type;
    l_task_offer_user_id public.task_offers.id%type;
    l_task_id public.task_offers.task_id%type;
    l_task_owner_id public.profiles.id%type;
    l_accepted_count bigint;
    return_id public.task_offers.id%type;
begin
    
    -- from user is the authenticated user
    l_user_id := auth.uid();

    -- get the task offer information
    select user_id
    ,      task_id
    ,      status
    into   l_task_offer_user_id
    ,      l_task_id
    ,      l_task_offer_status
    from   public.task_offers
    where  id = p_task_offer_id;
    
    -- get the task information
    select user_id
    ,      status
    ,      effort_people
    into   l_task_owner_id
    ,      l_task_status
    ,      l_task_effort_people
    from   public.tasks
    where  id = l_task_id;

    -- see how many task offers have already been accepted
    select count(*)
    into   l_accepted_count
    from   public.task_offers
    where  task_id = l_task_id
    and    status = 'Accepted';

    -- enforce business rules
    if (l_task_offer_status <> 'Pending') then
        raise exception 'Only pending tasks can be actioned';
    end if;

    if (p_status = 'Cancelled' and l_user_id <> l_task_offer_user_id) then
        raise exception 'Only the user who created the task offer can cancel it';
    end if;

    if (p_status = 'Accepted' and l_user_id <> l_task_owner_id) then
        raise exception 'Only the owner of the task can accept the task offer';
    end if;

    if (p_status = 'Accepted' and (l_task_status = 'Assigned' or l_task_status = 'Completed' or l_task_status = 'Closed')) then
        raise exception 'Only accept task offers where task isn''t assigned, completed or closed';
    end if;
    
    -- Update the task offer
    update public.task_offers
    set status = p_status
    ,   processed_datetime = now()::timestamp
    where id = p_task_offer_id
    returning id into return_id;

    -- Now update the task if the offer was accepted
    if (p_status = 'Accepted') then
        if (l_task_effort_people > l_accepted_count + 1) then
            l_task_status := 'Partially Assigned';
        else 
            l_task_status := 'Assigned';
        end if;

        update public.tasks
        set status = l_task_status
        where id = l_task_id;
    end if;

   
    -- We're returning the id of the message
    return return_id;
end;
$$ security definer;
