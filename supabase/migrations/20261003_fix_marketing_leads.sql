-- Allow the assessment to collect an email without forcing marketing consent.
-- Marketing consent remains an explicit optional choice.

drop policy if exists "public can insert marketing leads" on public.marketing_leads;

create policy "public can insert marketing leads"
  on public.marketing_leads
  for insert
  to anon, authenticated
  with check (
    length(trim(email)) between 5 and 254
    and position('@' in email) > 1
    and source = 'assessment'
  );

grant insert on public.marketing_leads to anon, authenticated;
