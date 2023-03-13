create or replace function public.create_task_offer(
   p_task_id public.tasks.id%type
)
returns public.task_messages.id%type
language plpgsql
as $$
declare
    /*
     * Creates a task offer
     */
    l_user_id public.profiles.id%type; 
    l_task_owner_id public.profiles.id%type;

    l_task_title public.tasks.title%type;
    l_feed_type public.feed.type%type;
    l_auth_user_full_name public.profiles.full_name%type;
    l_auth_user_avatar_url public.profiles.avatar_url%type;
    l_task_owner_full_name public.profiles.full_name%type;
    l_task_owner_avatar_url public.profiles.avatar_url%type;
    l_jsonb jsonb;

    return_id public.task_offers.id%type;
begin
    
    -- from user is the authenticated user
    l_user_id := auth.uid();

    -- get the owner of the task
    select user_id
    ,      title
    into   l_task_owner_id
    ,      l_task_title
    from   public.tasks
    where  id = p_task_id;

    -- Insert the message, accepting the default status
    insert into public.task_offers(
        user_id,
        task_id,
        task_owner_id
    ) values (
        l_user_id,
        p_task_id,
        l_task_owner_id
    ) returning id into return_id;


    -- Finally let's add this to the feed
    -- (one for the user who created the task offer and one for the task owner)
    l_feed_type := 'TaskOffer';
    
    -- Get the auth user information
    select full_name
    ,      avatar_url
    into   l_auth_user_full_name
    ,      l_auth_user_avatar_url
    from   public.profiles
    where  id = l_user_id;

    -- Get the task user information
    select full_name
    ,      avatar_url
    into   l_task_owner_full_name
    ,      l_task_owner_avatar_url
    from   public.profiles
    where  id = l_task_owner_id;


    -- Build the jsonb payload
    l_jsonb := json_build_object(
        'id', return_id,
        'taskId', p_task_id,
        'taskTitle', l_task_title,
        'userId', l_user_id,
        'userFullName', l_auth_user_full_name,
        'userAvatarUrl', l_auth_user_avatar_url,
        'taskOwnerId', l_task_owner_id,
        'taskOwnerFullName', l_task_owner_full_name,
        'taskOwnerAvatarUrl', l_task_owner_avatar_url
    );

    -- You
    -- insert into public.feed(
    --     user_id,
    --     you_actioned,
    --     type,
    --     payload
    -- ) values (
    --     l_user_id,
    --     true,
    --     l_feed_type,
    --     l_jsonb
    -- );

    -- Them
    insert into public.feed(
        user_id,
        you_actioned,
        type,
        payload
    ) values (
        l_task_owner_id,
        false,
        l_feed_type,
        l_jsonb
    );
   
    -- We're returning the id of the message
    return return_id;
end;
$$ security definer;

