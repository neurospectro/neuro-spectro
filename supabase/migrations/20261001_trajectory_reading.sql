-- NeuroSpectro: human trajectory reading product.
-- Informational, non-diagnostic service delivered by a partner specialist.

alter table public.produtos
  drop constraint if exists produtos_tipo_check;

alter table public.produtos
  add constraint produtos_tipo_check
  check (tipo in ('report','pdf','community','trajectory'));

insert into public.produtos (slug, nome, tipo)
values (
  'leitura-trajetoria',
  'Leitura de Trajetória NeuroSpectro',
  'trajectory'
)
on conflict (slug) do update
set nome = excluded.nome,
    tipo = excluded.tipo,
    ativo = true;

insert into public.ofertas (
  produto_id, slug, nome, billing_type, total_cents,
  installment_count, installment_cents, access_days, auto_renew, active
)
select
  p.id,
  'trajectory-reading-14990',
  'Leitura de Trajetória NeuroSpectro',
  'one_time_installments',
  14990,
  1,
  14990,
  null,
  false,
  true
from public.produtos p
where p.slug = 'leitura-trajetoria'
on conflict (slug) do update
set nome = excluded.nome,
    billing_type = excluded.billing_type,
    total_cents = excluded.total_cents,
    installment_count = excluded.installment_count,
    installment_cents = excluded.installment_cents,
    access_days = excluded.access_days,
    auto_renew = excluded.auto_renew,
    active = true;

create table if not exists public.leituras_trajetoria (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  pedido_id uuid references public.pedidos(id) on delete set null,
  email text not null,
  status text not null default 'draft' check (status in ('draft','submitted','in_review','completed','cancelled')),
  story text,
  development_notes text,
  current_context text,
  specialist_response text,
  submitted_at timestamptz,
  response_sent_at timestamptz,
  specialist_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists leituras_trajetoria_user_idx
  on public.leituras_trajetoria(user_id, created_at desc);

alter table public.leituras_trajetoria enable row level security;

drop policy if exists "users read own trajectory readings" on public.leituras_trajetoria;
create policy "users read own trajectory readings"
  on public.leituras_trajetoria for select
  using (auth.uid() = user_id);

drop policy if exists "users create own trajectory readings" on public.leituras_trajetoria;
create policy "users create own trajectory readings"
  on public.leituras_trajetoria for insert
  with check (auth.uid() = user_id);

drop policy if exists "users update own draft trajectory readings" on public.leituras_trajetoria;
create policy "users update own draft trajectory readings"
  on public.leituras_trajetoria for update
  using (auth.uid() = user_id and status = 'draft')
  with check (auth.uid() = user_id and status = 'draft');

-- Admins can operate the specialist queue. No public write access is granted.
drop policy if exists "admins read trajectory queue" on public.leituras_trajetoria;
create policy "admins read trajectory queue"
  on public.leituras_trajetoria for select
  using (public.is_admin());

drop policy if exists "admins update trajectory queue" on public.leituras_trajetoria;
create policy "admins update trajectory queue"
  on public.leituras_trajetoria for update
  using (public.is_admin())
  with check (public.is_admin());
