-- NeuroSpectro: Mercado Pago Orders API hardening and PDF offer.
-- Run after the existing billing/foundation migrations.

alter table public.acessos
  alter column expires_at drop not null;

create unique index if not exists pedidos_provider_order_uidx
  on public.pedidos(provider, provider_order_id)
  where provider is not null and provider_order_id is not null;

create unique index if not exists pagamentos_provider_payment_uidx
  on public.pagamentos(provider, provider_payment_id)
  where provider is not null and provider_payment_id is not null;

create unique index if not exists acessos_pedido_produto_uidx
  on public.acessos(user_id, produto_id, pedido_id)
  where pedido_id is not null;

insert into public.ofertas (
  produto_id, slug, nome, billing_type, total_cents,
  installment_count, installment_cents, access_days, auto_renew, active
)
select
  p.id,
  'pdf-report-1490',
  'Relatório PDF NeuroSpectro',
  'one_time_installments',
  1490,
  1,
  1490,
  null,
  false,
  true
from public.produtos p
where p.slug = 'relatorio-pdf'
on conflict (slug) do update
set nome = excluded.nome,
    billing_type = excluded.billing_type,
    total_cents = excluded.total_cents,
    installment_count = excluded.installment_count,
    installment_cents = excluded.installment_cents,
    access_days = excluded.access_days,
    auto_renew = excluded.auto_renew,
    active = true;

-- Keep the canonical community offer aligned with the frontend.
update public.ofertas
set active = false
where slug = 'community-12m-6x';

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
