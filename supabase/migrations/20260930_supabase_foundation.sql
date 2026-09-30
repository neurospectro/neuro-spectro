-- NeuroSpectro: Supabase foundation
-- Run after the existing NeuroSpectro migrations.
-- This migration prepares the profile table and makes indefinite access possible.

create extension if not exists pgcrypto;

create table if not exists public.usuarios (
  id uuid primary key references auth.users(id) on delete cascade,
  nome text,
  email text,
  whatsapp text,
  whatsapp_verified boolean not null default false,
  whatsapp_marketing_opt_in boolean not null default false,
  whatsapp_marketing_opt_in_at timestamptz,
  whatsapp_marketing_opt_in_source text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.usuarios enable row level security;

drop policy if exists "users read own profile" on public.usuarios;
create policy "users read own profile" on public.usuarios
  for select using (auth.uid() = id);

drop policy if exists "users update own profile" on public.usuarios;
create policy "users update own profile" on public.usuarios
  for update using (auth.uid() = id)
  with check (auth.uid() = id);

-- The frontend can create/update its own profile after authentication.
drop policy if exists "users insert own profile" on public.usuarios;
create policy "users insert own profile" on public.usuarios
  for insert with check (auth.uid() = id);

-- Keep auth.users and public.usuarios synchronized for new accounts.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.usuarios (id, email, nome)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name')
  )
  on conflict (id) do update
    set email = excluded.email,
        nome = coalesce(excluded.nome, public.usuarios.nome),
        updated_at = now();

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- The existing access model must support products with indefinite access.
alter table public.acessos
  alter column expires_at drop not null;

-- Products/offers are safe to expose only as active catalog information.
alter table public.produtos enable row level security;
alter table public.ofertas enable row level security;

drop policy if exists "public read active products" on public.produtos;
create policy "public read active products" on public.produtos
  for select using (ativo = true);

drop policy if exists "public read active offers" on public.ofertas;
create policy "public read active offers" on public.ofertas
  for select using (active = true);

-- Seed the current NeuroSpectro products. ON CONFLICT keeps this migration idempotent.
insert into public.produtos (slug, nome, tipo)
values
  ('relatorio-completo', 'Relatório Completo NeuroSpectro', 'report'),
  ('relatorio-pdf', 'Relatório PDF NeuroSpectro', 'pdf'),
  ('comunidade-apoio', 'Comunidade de Apoio - NeuroSpectro', 'community')
on conflict (slug) do update
set nome = excluded.nome,
    tipo = excluded.tipo,
    ativo = true;

-- Current main offer: R$ 24,90, one-time purchase.
insert into public.ofertas (
  produto_id, slug, nome, billing_type, total_cents,
  installment_count, installment_cents, access_days, auto_renew, active
)
select
  p.id,
  'report-full-2490',
  'Relatório Completo NeuroSpectro',
  'one_time_installments',
  2490,
  1,
  2490,
  null,
  false,
  true
from public.produtos p
where p.slug = 'relatorio-completo'
on conflict (slug) do update
set nome = excluded.nome,
    billing_type = excluded.billing_type,
    total_cents = excluded.total_cents,
    installment_count = excluded.installment_count,
    installment_cents = excluded.installment_cents,
    access_days = excluded.access_days,
    auto_renew = excluded.auto_renew,
    active = true;

-- Current community offer: 6 x R$ 14,90, total R$ 89,40,
-- one-time installment purchase with indefinite access and no auto-renewal.
insert into public.ofertas (
  produto_id, slug, nome, billing_type, total_cents,
  installment_count, installment_cents, access_days, auto_renew, active
)
select
  p.id,
  'community-6x-1490',
  'Comunidade de Apoio - NeuroSpectro',
  'one_time_installments',
  8940,
  6,
  1490,
  null,
  false,
  true
from public.produtos p
where p.slug = 'comunidade-apoio'
on conflict (slug) do update
set nome = excluded.nome,
    billing_type = excluded.billing_type,
    total_cents = excluded.total_cents,
    installment_count = excluded.installment_count,
    installment_cents = excluded.installment_cents,
    access_days = excluded.access_days,
    auto_renew = excluded.auto_renew,
    active = true;
