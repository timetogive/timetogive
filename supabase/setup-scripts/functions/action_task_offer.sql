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
    l_task_title public.tasks.title%type;
    l_task_status public.tasks.status%type;
    l_task_effort_people public.tasks.effort_people%type;
    l_task_offer_status public.task_offers.status%type;
    l_task_offer_user_id public.task_offers.id%type;
    l_task_offer_user_full_name public.profiles.full_name%type;
    l_task_offer_user_avatar_url public.profiles.avatar_url%type;
    l_task_id public.task_offers.task_id%type;
    l_task_owner_id public.profiles.id%type;
    l_accepted_count bigint;
    l_notifications_type public.notifications.type%type;
    l_task_owner_full_name public.profiles.full_name%type;
    l_task_owner_avatar_url public.profiles.avatar_url%type;
    l_jsonb jsonb;
    return_id public.task_offers.id%type;
begin
    
    -- from user is the authenticated user
    l_user_id := auth.uid();

    -- get all the information needed in one hit
    select t.user_id
    ,      p.full_name
    ,      p.avatar_url
    ,      t.status
    ,      t.task_id
    ,      ta.user_id
    ,      ta.title
    ,      ta.status
    ,      ta.effort_people
    ,      po.full_name
    ,      po.avatar_url
    into   l_task_offer_user_id
    ,      l_task_offer_user_full_name 
    ,      l_task_offer_user_avatar_url 
    ,      l_task_offer_status
    ,      l_task_id
    ,      l_task_owner_id
    ,      l_task_title
    ,      l_task_status
    ,      l_task_effort_people
    ,      l_task_owner_full_name
    ,      l_task_owner_avatar_url
    from   public.task_offers t
    ,      public.profiles p
    ,      public.tasks ta
    ,      public.profiles po
    where  t.id = p_task_offer_id
    and    t.user_id = p.id
    and    t.task_id = ta.id
    and    ta.user_id = po.id;
    
    -- enforce business rules
    if (l_task_offer_status <> 'Pending') then
        raise exception 'Only pending tasks can be actioned';
    end if;

    if (p_status = 'Cancelled' and l_user_id <> l_task_offer_user_id) then
        raise exception 'Only the user who created the task offer can cancel it';
    end if;

    if ((p_status = 'Accepted' or p_status = 'Declined') and l_user_id <> l_task_owner_id) then
        raise exception 'Only the owner of the task can accept the task offer';
    end if;

    if (p_status = 'Accepted' and (l_task_status = 'Assigned' or l_task_status = 'Completed' or l_task_status = 'Closed')) then
        raise exception 'Only accept task offers where task isn''t assigned, completed or closed';
    end if;

    -- see how many task offers have already been accepted
    select count(*)
    into   l_accepted_count
    from   public.task_offers
    where  task_id = l_task_id
    and    status = 'Accepted';
    
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

    -- Finally let's add this to the notifications
    -- (one for the user who created the task offer and one for the task owner)
    if (p_status = 'Accepted') then
        l_notifications_type := 'TaskOfferAccepted';
    elsif (p_status = 'Declined') then
        l_notifications_type := 'TaskOfferDeclined';
    elsif (p_status = 'Cancelled') then
        l_notifications_type := 'TaskOfferCancelled';
    end if;


    -- Build the jsonb payload
    l_jsonb := json_build_object(
        'taskId', l_task_id,
        'taskTitle', l_task_title,
        'taskOfferId', p_task_offer_id,
        'taskOfferUserId', l_task_offer_user_id,
        'taskOfferUserFullName', l_task_offer_user_full_name,
        'taskOfferUserAvatarUrl', l_task_offer_user_avatar_url,
        'taskOwnerId', l_task_owner_id,
        'taskOwnerFullName', l_task_owner_full_name,
        'taskOwnerAvatarUrl', l_task_owner_avatar_url
    );

    -- Record in the notifications who did it
    -- insert into public.notifications(
    --     user_id,
    --     you_actioned,
    --     type,
    --     payload
    -- ) values (
    --     l_user_id,
    --     true,
    --     l_notifications_type,
    --     l_jsonb
    -- );

    -- If accepted or declined then let person who made
    -- the task offer know
    if (p_status = 'Accepted' or p_status = 'Declined') then
        insert into public.notifications(
            user_id,
            you_actioned,
            type,
            payload
        ) values (
            l_task_offer_user_id,
            false,
            l_notifications_type,
            l_jsonb
        );
    end if;

    -- If cancelled then let the task owner know
    if (p_status = 'Cancelled') then
        insert into public.notifications(
            user_id,
            you_actioned,
            type,
            payload
        ) values (
            l_task_owner_id,
            false,
            l_notifications_type,
            l_jsonb
        );
    end if;

    -- We're returning the id of the message
    return return_id;
end;
$$ security definer;

