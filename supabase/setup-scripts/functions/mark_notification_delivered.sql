
create or replace function public.mark_notification_delivered(
   p_notification_id public.notifications.id%type
)
returns boolean
language plpgsql
as $$
declare
    /*
     * Marks all task messages in a conversation as read
     * for messages sent to the authenticated user
     */
    l_user_id public.profiles.id%type;
    return_id public.task_offers.id%type;
begin
    
    -- from user is the authenticated user
    l_user_id := auth.uid();

    update notifications
    set delivered = true
    ,   delivered_datetime = now()::timestamp
    where id = p_notification_id;

    -- We're returning the id of the task (slightly arbitrary)
    return true;
end;
$$ security definer;

