-- Apply in the Supabase SQL Editor.
-- Paid analysis must only be readable with an active "relatorio-completo" entitlement.
-- Owners keep direct access to non-paid columns; the analysis column is served only via RPC.

revoke select on public.resultados from authenticated, anon;
grant select (id, sessao_id, user_id, scores, total_raw, max_raw, created_at, lead_email)
  on public.resultados to authenticated;
grant all on public.resultados to service_role;

create or replace function public.get_full_report()
returns table (
  id uuid,
  created_at timestamptz,
  total_raw integer,
  max_raw integer,
  scores jsonb,
  analysis jsonb
)
language sql
stable
security definer
set search_path = public
as $$
  select r.id, r.created_at, r.total_raw, r.max_raw, r.scores, r.analysis
  from public.resultados r
  where r.user_id = auth.uid()
    and exists (
      select 1
      from public.acessos a
      join public.produtos p on p.id = a.produto_id
      where a.user_id = auth.uid()
        and a.status = 'active'
        and p.slug = 'relatorio-completo'
        and (a.expires_at is null or a.expires_at > now())
    )
  order by r.created_at desc
  limit 1
$$;

revoke all on function public.get_full_report() from public, anon;
grant execute on function public.get_full_report() to authenticated;
