create or replace function public.save_home_polygon(
    p_home_polygon json
)
returns public.prefs.id%type
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

    update public.prefs
    set    home_polygon = p_home_polygon
    where  id = l_user_id
    returning id into return_id;
   
    -- We're returning the id of the message
    return return_id;
end;
$$ security definer;

