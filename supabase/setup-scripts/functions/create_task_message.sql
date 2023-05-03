create or replace function public.create_task_message(
   task_id public.tasks.id%type,
   to_user_id public.profiles.id%type,
   message_text public.task_messages.message_text%type
)
returns public.task_messages.id%type
language plpgsql
as $$
declare
    /*
     * Sends a message from send to the owner
     */
    from_user_id public.profiles.id%type; 
    return_id public.task_messages.id%type;

    l_task_owner_id public.profiles.id%type;
    l_task_title public.tasks.title%type;
    l_notifications_type public.notifications.type%type;
    l_auth_user_full_name public.profiles.full_name%type;
    l_auth_user_avatar_url public.profiles.avatar_url%type;
    l_task_owner_full_name public.profiles.full_name%type;
    l_task_owner_avatar_url public.profiles.avatar_url%type;
    l_jsonb jsonb;

begin
    
    -- from user is the authenticated user
    from_user_id := auth.uid();

    -- Insert the message
    insert into public.task_messages(
        task_id,
        from_user_id,
        to_user_id,
        message_text
    ) values (
        task_id,
        from_user_id,
        to_user_id,
        message_text
    ) returning id into return_id;


    -- Finally let's add this to the notifications
    -- (one for the user who created the task message)
    l_notifications_type := 'TaskMessage';

    -- get extra information about the task
    select user_id
    ,      title
    into   l_task_owner_id
    ,      l_task_title
    from   public.tasks
    where  id = task_id;

    
    -- Get the auth user information
    select full_name
    ,      avatar_url
    into   l_auth_user_full_name
    ,      l_auth_user_avatar_url
    from   public.profiles
    where  id = from_user_id;

    -- Get the task user information
    select full_name
    ,      avatar_url
    into   l_task_owner_full_name
    ,      l_task_owner_avatar_url
    from   public.profiles
    where  id = l_task_owner_id;

    -- Build the jsonb payload
    l_jsonb := json_build_object(
        'taskId', task_id,
        'taskTitle', l_task_title,
        'taskOwnerId', l_task_owner_id,
        'taskOwnerFullName', l_task_owner_full_name,
        'taskOwnerAvatarUrl', l_task_owner_avatar_url,
        'taskMessageId', return_id,
        'taskMessageText', message_text,
        'taskMessageFromUserId', from_user_id,
        'taskMessageFromUserFullName', l_auth_user_full_name,
        'taskMessageFromUserAvatarUrl', l_auth_user_avatar_url
    );

    insert into public.notifications(
        user_id,
        you_actioned,
        type,
        payload
    ) values (
        to_user_id,
        false,
        l_notifications_type,
        l_jsonb
    );


    -- We're returning the id of the message
    return return_id;
end;
$$ security definer;

