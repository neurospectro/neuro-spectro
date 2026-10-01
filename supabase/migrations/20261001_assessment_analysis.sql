alter table public.resultados
  add column if not exists analysis jsonb;

create index if not exists resultados_user_created_idx
  on public.resultados(user_id, created_at desc);
