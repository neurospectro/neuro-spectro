create table if not exists public.payment_rate_limits (
  key_hash text primary key,
  window_started_at timestamptz not null default now(),
  request_count integer not null default 0
);

alter table public.payment_rate_limits enable row level security;

revoke all on table public.payment_rate_limits from anon, authenticated;

create or replace function public.consume_payment_rate_limit(
  p_key_hash text,
  p_window_seconds integer,
  p_max_requests integer
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  current_window timestamptz;
  current_count integer;
begin
  if p_key_hash is null or length(p_key_hash) = 0
     or p_window_seconds <= 0 or p_max_requests <= 0 then
    return false;
  end if;

  insert into public.payment_rate_limits (key_hash, window_started_at, request_count)
  values (p_key_hash, now(), 0)
  on conflict (key_hash) do nothing;

  select window_started_at, request_count
    into current_window, current_count
    from public.payment_rate_limits
    where key_hash = p_key_hash
    for update;

  if now() >= current_window + make_interval(secs => p_window_seconds) then
    update public.payment_rate_limits
       set window_started_at = now(),
           request_count = 1
     where key_hash = p_key_hash;
    return true;
  end if;

  if current_count >= p_max_requests then
    return false;
  end if;

  update public.payment_rate_limits
     set request_count = current_count + 1
   where key_hash = p_key_hash;

  return true;
end;
$$;

revoke all on function public.consume_payment_rate_limit(text, integer, integer) from public, anon, authenticated;
grant execute on function public.consume_payment_rate_limit(text, integer, integer) to service_role;

create index if not exists payment_rate_limits_window_idx
  on public.payment_rate_limits(window_started_at);
