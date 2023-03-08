drop function public.mark_task_conversation_read;

create or replace function public.mark_task_conversation_read(
   p_task_id public.tasks.id%type,
   p_user_id public.profiles.id%type
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

    update task_messages
    set is_read = true
    where task_id = p_task_id
    and   to_user_id = l_user_id
    and   from_user_id = p_user_id;

    -- We're returning the id of the task (slightly arbitrary)
    return true;
end;
$$ security definer;

