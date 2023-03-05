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
    return_id public.task_offers.id%type;
begin
    
    -- from user is the authenticated user
    l_user_id := auth.uid();

    -- get the owner of the task
    select user_id
    into   l_task_owner_id
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
   
    -- We're returning the id of the message
    return return_id;
end;
$$ security definer;

