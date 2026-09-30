-- Depoimentos de usuários: enviados autenticados, publicados somente após aprovação.
create table if not exists public.depoimentos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null check (char_length(trim(name)) between 2 and 80),
  text text not null check (char_length(trim(text)) between 10 and 1000),
  consented_to_publish boolean not null default false,
  status text not null default 'PENDING' check (status in ('PENDING','APPROVED','HIDDEN')),
  created_at timestamptz not null default now(),
  approved_at timestamptz,
  approved_by uuid references auth.users(id)
);

alter table public.depoimentos enable row level security;

revoke all on table public.depoimentos from anon;
grant select, insert on table public.depoimentos to authenticated;

drop policy if exists "Users can read their own testimonials" on public.depoimentos;
create policy "Users can read their own testimonials"
on public.depoimentos for select
to authenticated
using ((select auth.uid()) = user_id);

drop policy if exists "Users can submit their own testimonials" on public.depoimentos;
create policy "Users can submit their own testimonials"
on public.depoimentos for insert
to authenticated
with check (
  (select auth.uid()) = user_id
  and status = 'PENDING'
  and consented_to_publish = true
);

create index if not exists depoimentos_user_id_idx on public.depoimentos(user_id);
create index if not exists depoimentos_status_idx on public.depoimentos(status);

comment on table public.depoimentos is 'Depoimentos enviados por usuários. Nunca publicar diretamente: somente status APPROVED.';
comment on column public.depoimentos.consented_to_publish is 'Consentimento explícito para publicação do depoimento.';
