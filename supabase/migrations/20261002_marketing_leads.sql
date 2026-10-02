create table if not exists public.marketing_leads (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  marketing_consent boolean not null default false,
  source text not null default 'assessment',
  created_at timestamptz not null default now(),
  unique (email)
);

alter table public.marketing_leads enable row level security;

revoke all on table public.marketing_leads from anon, authenticated;

drop policy if exists "public can insert marketing leads" on public.marketing_leads;
create policy "public can insert marketing leads"
  on public.marketing_leads
  for insert
  to anon, authenticated
  with check (
    length(trim(email)) between 5 and 254
    and position('@' in email) > 1
    and marketing_consent = true
    and source = 'assessment'
  );

grant insert on public.marketing_leads to anon, authenticated;

create index if not exists marketing_leads_created_idx
  on public.marketing_leads(created_at desc);
