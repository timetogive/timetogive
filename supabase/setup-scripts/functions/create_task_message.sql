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

    -- We're returning the id of the message
    return return_id;
end;
$$ security definer;

