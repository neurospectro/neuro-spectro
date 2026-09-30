-- NeuroSpectro: products, orders, payments, subscriptions and access control.
-- Execute in Supabase SQL Editor after creating the project.
-- Access is controlled by expires_at; the frontend must never be the source of truth.

create extension if not exists pgcrypto;

create table if not exists public.produtos (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  nome text not null,
  tipo text not null check (tipo in ('report','pdf','community')),
  ativo boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.ofertas (
  id uuid primary key default gen_random_uuid(),
  produto_id uuid not null references public.produtos(id),
  slug text unique not null,
  nome text not null,
  billing_type text not null check (billing_type in ('one_time_installments','recurring')),
  total_cents integer not null check (total_cents > 0),
  installment_count integer not null default 1 check (installment_count > 0),
  installment_cents integer not null check (installment_cents > 0),
  access_days integer not null check (access_days > 0),
  auto_renew boolean not null default false,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.pedidos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  oferta_id uuid not null references public.ofertas(id),
  status text not null default 'pending' check (status in ('pending','paid','failed','refunded','cancelled','chargeback')),
  provider text,
  provider_order_id text,
  amount_cents integer not null,
  installments integer not null default 1,
  created_at timestamptz not null default now(),
  paid_at timestamptz
);

create table if not exists public.pagamentos (
  id uuid primary key default gen_random_uuid(),
  pedido_id uuid not null references public.pedidos(id) on delete cascade,
  provider text not null,
  provider_payment_id text,
  status text not null,
  amount_cents integer not null,
  installment_number integer,
  raw_status_detail text,
  paid_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.assinaturas (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  oferta_id uuid not null references public.ofertas(id),
  provider text not null,
  provider_subscription_id text,
  status text not null check (status in ('active','paused','past_due','cancelled','expired')),
  current_period_start timestamptz,
  current_period_end timestamptz,
  cancel_at_period_end boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.acessos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  produto_id uuid not null references public.produtos(id),
  pedido_id uuid references public.pedidos(id) on delete set null,
  subscription_id uuid references public.assinaturas(id) on delete set null,
  starts_at timestamptz not null,
  expires_at timestamptz not null,
  status text not null default 'active' check (status in ('active','expired','revoked')),
  created_at timestamptz not null default now()
);

create index if not exists acessos_user_produto_idx on public.acessos(user_id, produto_id);
create index if not exists acessos_expiration_idx on public.acessos(expires_at);
create index if not exists pedidos_user_idx on public.pedidos(user_id);
create index if not exists pagamentos_pedido_idx on public.pagamentos(pedido_id);

-- Webhook idempotency: never grant access twice for the same provider event.
create table if not exists public.webhook_events (
  id uuid primary key default gen_random_uuid(),
  provider text not null,
  event_id text not null,
  event_type text,
  processed_at timestamptz,
  payload jsonb,
  unique(provider, event_id)
);

-- Marketing consent is separate from operational WhatsApp contact.
alter table public.usuarios
  add column if not exists whatsapp text,
  add column if not exists whatsapp_verified boolean not null default false,
  add column if not exists whatsapp_marketing_opt_in boolean not null default false,
  add column if not exists whatsapp_marketing_opt_in_at timestamptz,
  add column if not exists whatsapp_marketing_opt_in_source text;

alter table public.acessos enable row level security;
alter table public.pedidos enable row level security;
alter table public.pagamentos enable row level security;
alter table public.assinaturas enable row level security;

drop policy if exists "users read own access" on public.acessos;
create policy "users read own access" on public.acessos
  for select using (auth.uid() = user_id);

drop policy if exists "users read own orders" on public.pedidos;
create policy "users read own orders" on public.pedidos
  for select using (auth.uid() = user_id);

drop policy if exists "users read own payments" on public.pagamentos;
create policy "users read own payments" on public.pagamentos
  for select using (
    exists (
      select 1 from public.pedidos p
      where p.id = pedido_id and p.user_id = auth.uid()
    )
  );

drop policy if exists "users read own subscriptions" on public.assinaturas;
create policy "users read own subscriptions" on public.assinaturas
  for select using (auth.uid() = user_id);

-- IMPORTANT:
-- Only a trusted server/webhook using the Supabase service role should INSERT/UPDATE
-- pedidos, pagamentos, assinaturas and acessos after payment confirmation.
