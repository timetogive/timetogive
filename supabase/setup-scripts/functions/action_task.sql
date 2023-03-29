create or replace function public.action_task(
   p_task_id public.tasks.id%type,
   p_status public.tasks.status%type
)
returns public.tasks.id%type
language plpgsql
as $$
declare
    /*
     * Sets the status of a task offer
     */
    l_user_id public.profiles.id%type;
    l_status public.tasks.status%type;
    l_task_owner_id public.profiles.id%type;
    l_accepted_count bigint;
    l_task_effort_people public.tasks.effort_people%type;
    return_id public.tasks.id%type;
begin
    
    -- from user is the authenticated user
    l_user_id := auth.uid();

    select t.user_id
    ,      t.effort_people
    into   l_task_owner_id
    ,      l_task_effort_people
    from   public.tasks t
    where  t.id = p_task_id;

    if (l_task_owner_id <> l_user_id) then
        raise exception 'Only the owner can action the task';
    end if;

    if (p_status = 'Assigned' or p_status = 'Partially Assigned') then
        raise exception 'You can not manually set the status to Assigned or Partially Assigned';
    end if;

    l_status := p_status;

    if (p_status = 'Live') then
        -- Restore the correct status depending on how many 
        -- people have been assigned
        select count(*)
        into   l_accepted_count
        from   public.task_offers
        where  task_id = p_task_id
        and    status = 'Accepted';
        if (l_task_effort_people > l_accepted_count) then
            l_status := 'Partially Assigned';
        elsif (l_task_effort_people = l_accepted_count) then
            l_status := 'Assigned';
        end if;
    end if;

    -- Update the task 
    update public.tasks
    set status = l_status
    where id = p_task_id
    returning id into return_id;

    -- We're returning the id of the task
    return return_id;
end;
$$ security definer;

