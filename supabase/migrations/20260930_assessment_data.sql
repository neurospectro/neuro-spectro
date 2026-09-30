-- NeuroSpectro: persist assessment sessions, answers and results in Supabase.
create table if not exists public.sessoes_teste (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  assessment_id text not null,
  assessment_version text not null,
  started_at timestamptz not null,
  finished_at timestamptz,
  status text not null default 'in_progress' check (status in ('in_progress','completed','abandoned')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.respostas (
  id uuid primary key default gen_random_uuid(),
  sessao_id uuid not null references public.sessoes_teste(id) on delete cascade,
  question_id text not null,
  value integer not null check (value between 0 and 3),
  created_at timestamptz not null default now(),
  unique(sessao_id, question_id)
);

create table if not exists public.resultados (
  id uuid primary key default gen_random_uuid(),
  sessao_id uuid not null unique references public.sessoes_teste(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  scores jsonb not null,
  total_raw integer not null,
  max_raw integer not null,
  created_at timestamptz not null default now()
);

create index if not exists sessoes_teste_user_idx on public.sessoes_teste(user_id);
create index if not exists respostas_sessao_idx on public.respostas(sessao_id);
create index if not exists resultados_user_idx on public.resultados(user_id);

alter table public.sessoes_teste enable row level security;
alter table public.respostas enable row level security;
alter table public.resultados enable row level security;

drop policy if exists "users read own sessions" on public.sessoes_teste;
create policy "users read own sessions" on public.sessoes_teste
  for select using (auth.uid() = user_id);

drop policy if exists "users insert own sessions" on public.sessoes_teste;
create policy "users insert own sessions" on public.sessoes_teste
  for insert with check (auth.uid() = user_id);

drop policy if exists "users update own sessions" on public.sessoes_teste;
create policy "users update own sessions" on public.sessoes_teste
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "users read own answers" on public.respostas;
create policy "users read own answers" on public.respostas
  for select using (
    exists (select 1 from public.sessoes_teste s where s.id = sessao_id and s.user_id = auth.uid())
  );

drop policy if exists "users insert own answers" on public.respostas;
create policy "users insert own answers" on public.respostas
  for insert with check (
    exists (select 1 from public.sessoes_teste s where s.id = sessao_id and s.user_id = auth.uid())
  );

drop policy if exists "users update own answers" on public.respostas;
create policy "users update own answers" on public.respostas
  for update using (
    exists (select 1 from public.sessoes_teste s where s.id = sessao_id and s.user_id = auth.uid())
  ) with check (
    exists (select 1 from public.sessoes_teste s where s.id = sessao_id and s.user_id = auth.uid())
  );

drop policy if exists "users read own results" on public.resultados;
create policy "users read own results" on public.resultados
  for select using (auth.uid() = user_id);

drop policy if exists "users insert own results" on public.resultados;
create policy "users insert own results" on public.resultados
  for insert with check (auth.uid() = user_id);

drop policy if exists "users update own results" on public.resultados;
create policy "users update own results" on public.resultados
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
