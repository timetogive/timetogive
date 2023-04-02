create or replace function public.account_check(
   p_email_address text
)
returns boolean
language plpgsql
as $$
declare
  l_count integer;
begin

    select count(*) into l_count from auth.users where email = lower(p_email_address);
    if l_count > 0 then
        return true;
    else
        return false;
    end if;

end;
$$ security definer;


