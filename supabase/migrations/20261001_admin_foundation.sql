-- NeuroSpectro: admin foundation
-- Creates a server-enforced admin allowlist and read-only admin access policies.

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.admin_users enable row level security;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.admin_users
    where user_id = auth.uid()
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated;

drop policy if exists "admins read own admin record" on public.admin_users;
create policy "admins read own admin record" on public.admin_users
  for select using (user_id = auth.uid());

drop policy if exists "admins read profiles" on public.usuarios;
create policy "admins read profiles" on public.usuarios
  for select using (public.is_admin());

drop policy if exists "admins read orders" on public.pedidos;
create policy "admins read orders" on public.pedidos
  for select using (public.is_admin());

drop policy if exists "admins read payments" on public.pagamentos;
create policy "admins read payments" on public.pagamentos
  for select using (public.is_admin());

drop policy if exists "admins read products" on public.produtos;
create policy "admins read products" on public.produtos
  for select using (public.is_admin() or ativo = true);

drop policy if exists "admins read offers" on public.ofertas;
create policy "admins read offers" on public.ofertas
  for select using (public.is_admin() or active = true);

drop policy if exists "admins read webhook events" on public.webhook_events;
create policy "admins read webhook events" on public.webhook_events
  for select using (public.is_admin());

create index if not exists admin_users_user_idx on public.admin_users(user_id);
