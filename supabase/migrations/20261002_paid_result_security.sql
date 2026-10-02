-- NeuroSpectro: secure paid-result access foundation.
-- This migration must be applied to the Supabase project before the client changes
-- that consume process-payment?action=get_result can be considered production-ready.

-- Lifetime products (including report/PDF/trajectory) legitimately use NULL expires_at.
alter table public.acessos
  alter column expires_at drop not null;

-- Paid analysis must not be directly readable through the Data API.
-- Keep INSERT for the assessment persistence flow; reads will go through the
-- authenticated server-side process-payment function, which checks ownership
-- and paid access before returning data.
drop policy if exists "users read own results" on public.resultados;
drop policy if exists "users update own results" on public.resultados;

-- Explicitly preserve the user's ability to create their own result.
drop policy if exists "users insert own results" on public.resultados;
create policy "users insert own results"
on public.resultados
for insert
to authenticated
with check ((select auth.uid()) = user_id);

-- No SELECT/UPDATE/DELETE policy is intentionally created here.
-- This prevents direct reads of the paid analysis through Supabase REST/PostgREST.
