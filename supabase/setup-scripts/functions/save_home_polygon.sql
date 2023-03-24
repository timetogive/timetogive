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
    l_polygon_as_geography geography;
    return_id public.task_offers.id%type;
begin
    
    -- from user is the authenticated user
    l_user_id := auth.uid();

    -- Update the user's home polygon (this is JSON for convenience on the frontend)    
    update public.prefs
    set    home_polygon = p_home_polygon
    where  id = l_user_id
    returning id into return_id;

    l_polygon_as_geography := ST_GeomFromGeoJSON(p_home_polygon)::geography;

    -- We also update the geo_tracking table storing it in native postgres geography format
    -- to deal with performance of queries
    update public.geo_tracking
    set    home_polygon = l_polygon_as_geography
    where  id = l_user_id;
   
    -- We're returning the id of the message
    return return_id;
end;
$$ security definer;

