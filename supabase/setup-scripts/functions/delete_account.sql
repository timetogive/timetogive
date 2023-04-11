create or replace function public.delete_account()
returns public.tasks.id%type
language plpgsql
as $$
declare
    /*
     * Sets an account as deleted
     */
    l_user_id public.profiles.id%type;
    l_date_str text;
begin

    -- TODO we need a batch job for deleting users after X period of time
    
    -- from user is the authenticated user
    l_user_id := auth.uid();

    -- random guid string to use as a unique identifier for the rename
    l_date_str := to_char(now(), 'YYYYMMDDHH24MISS');

    update auth.users
    set   email = concat(email, '_deleted_at_'||l_date_str)
    where id = l_user_id;

    delete from auth.identities
    where user_id = l_user_id;

    delete from auth.sessions
    where user_id = l_user_id;

    -- We're returning the id of the user
    return l_user_id;
end;
$$ security definer;

