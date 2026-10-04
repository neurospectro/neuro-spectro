-- Harden admin authorization: avoid SECURITY DEFINER for the browser-facing admin check.

create or replace function public.is_admin()
returns boolean
language sql
stable
security invoker
set search_path = public
as $function$
  select exists (
    select 1
    from public.admin_users
    where user_id = (select auth.uid())
  );
$function$;

revoke execute on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated;
