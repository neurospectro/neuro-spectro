-- NeuroSpectro: link anonymous purchases/assessments to the verified email account.
-- The email is only used as a claim key after the user has authenticated with Supabase Auth.

alter table public.pedidos
  add column if not exists payer_email text;

create index if not exists pedidos_payer_email_idx
  on public.pedidos(lower(payer_email));

alter table public.sessoes_teste
  add column if not exists lead_email text;

create index if not exists sessoes_teste_lead_email_idx
  on public.sessoes_teste(lower(lead_email));

alter table public.resultados
  add column if not exists lead_email text;

create index if not exists resultados_lead_email_idx
  on public.resultados(lower(lead_email));

create or replace function public.claim_identity_records()
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  current_user_id uuid := auth.uid();
  current_email text := lower(trim(auth.email()));
  orders_claimed integer := 0;
  accesses_claimed integer := 0;
  sessions_claimed integer := 0;
  results_claimed integer := 0;
begin
  if current_user_id is null or current_email is null or current_email = '' then
    return jsonb_build_object('ok', false, 'reason', 'authenticated_email_required');
  end if;

  update public.pedidos
     set user_id = current_user_id
   where lower(trim(payer_email)) = current_email
     and (user_id is null or user_id <> current_user_id);
  get diagnostics orders_claimed = row_count;

  update public.acessos a
     set user_id = current_user_id
   where exists (
     select 1
       from public.pedidos p
      where p.id = a.pedido_id
        and lower(trim(p.payer_email)) = current_email
   )
     and (a.user_id is null or a.user_id <> current_user_id);
  get diagnostics accesses_claimed = row_count;

  update public.sessoes_teste
     set user_id = current_user_id
   where lower(trim(lead_email)) = current_email
     and (user_id is null or user_id <> current_user_id);
  get diagnostics sessions_claimed = row_count;

  update public.resultados
     set user_id = current_user_id
   where lower(trim(lead_email)) = current_email
     and (user_id is null or user_id <> current_user_id);
  get diagnostics results_claimed = row_count;

  return jsonb_build_object(
    'ok', true,
    'orders_claimed', orders_claimed,
    'accesses_claimed', accesses_claimed,
    'sessions_claimed', sessions_claimed,
    'results_claimed', results_claimed
  );
end;
$$;

revoke all on function public.claim_identity_records() from public;
grant execute on function public.claim_identity_records() to authenticated;
