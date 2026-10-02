create table if not exists public.pdf_report_jobs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  result_id uuid not null references public.resultados(id) on delete cascade,
  status text not null default 'pending' check (status in ('pending','processing','completed','failed')),
  storage_path text,
  error_message text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  completed_at timestamptz,
  unique (user_id, result_id)
);

alter table public.pdf_report_jobs enable row level security;

drop policy if exists "users read own pdf jobs" on public.pdf_report_jobs;
create policy "users read own pdf jobs" on public.pdf_report_jobs
  for select to authenticated using (auth.uid() = user_id);

drop policy if exists "users create own pdf jobs" on public.pdf_report_jobs;
create policy "users create own pdf jobs" on public.pdf_report_jobs
  for insert to authenticated with check (auth.uid() = user_id);

revoke all on public.pdf_report_jobs from anon;
grant select, insert on public.pdf_report_jobs to authenticated;

create index if not exists pdf_report_jobs_user_created_idx
  on public.pdf_report_jobs(user_id, created_at desc);

insert into storage.buckets (id, name, public)
values ('private-reports', 'private-reports', false)
on conflict (id) do update set public = false;

drop policy if exists "users read own private reports" on storage.objects;
create policy "users read own private reports" on storage.objects
  for select to authenticated
  using (bucket_id = 'private-reports' and (storage.foldername(name))[1] = auth.uid()::text);

revoke all on storage.objects from anon;
