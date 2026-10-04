alter table public.sessoes_teste add column if not exists is_admin_test boolean not null default false;
alter table public.resultados add column if not exists is_admin_test boolean not null default false;
create index if not exists sessoes_teste_admin_test_idx on public.sessoes_teste(is_admin_test, created_at desc);
create index if not exists resultados_admin_test_idx on public.resultados(is_admin_test, created_at desc);