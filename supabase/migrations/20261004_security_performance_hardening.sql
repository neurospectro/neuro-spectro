-- Security and performance hardening: ownership RLS, auth evaluation, FK indexes, RPC exposure.

alter policy "users read own access" on public.acessos to authenticated;
alter policy "users read own subscriptions" on public.assinaturas to authenticated;
alter policy "users read own payments" on public.pagamentos to authenticated;
alter policy "users read own orders" on public.pedidos to authenticated;
alter policy "users insert own results" on public.resultados to authenticated;
alter policy "users read own results" on public.resultados to authenticated;
alter policy "users update own results" on public.resultados to authenticated;
alter policy "users insert own sessions" on public.sessoes_teste to authenticated;
alter policy "users read own sessions" on public.sessoes_teste to authenticated;
alter policy "users update own sessions" on public.sessoes_teste to authenticated;
alter policy "users insert own profile" on public.usuarios to authenticated;
alter policy "users read own profile" on public.usuarios to authenticated;
alter policy "users update own profile" on public.usuarios to authenticated;

alter policy "users read own access" on public.acessos using ((select auth.uid()) = user_id);
alter policy "users read own subscriptions" on public.assinaturas using ((select auth.uid()) = user_id);
alter policy "users read own payments" on public.pagamentos using (exists (select 1 from public.pedidos p where p.id = pagamentos.pedido_id and p.user_id = (select auth.uid())));
alter policy "users read own orders" on public.pedidos using ((select auth.uid()) = user_id);
alter policy "users insert own results" on public.resultados with check ((select auth.uid()) = user_id);
alter policy "users read own results" on public.resultados using ((select auth.uid()) = user_id);
alter policy "users update own results" on public.resultados using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
alter policy "users insert own sessions" on public.sessoes_teste with check ((select auth.uid()) = user_id);
alter policy "users read own sessions" on public.sessoes_teste using ((select auth.uid()) = user_id);
alter policy "users update own sessions" on public.sessoes_teste using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
alter policy "users insert own profile" on public.usuarios with check ((select auth.uid()) = id);
alter policy "users read own profile" on public.usuarios using ((select auth.uid()) = id);
alter policy "users update own profile" on public.usuarios using ((select auth.uid()) = id) with check ((select auth.uid()) = id);
alter policy "admins read own admin record" on public.admin_users using (user_id = (select auth.uid()));

revoke execute on function public.handle_new_user() from public, anon, authenticated;
revoke execute on function public.rls_auto_enable() from public, anon, authenticated;
revoke execute on function public.has_paid_access() from anon;
revoke execute on function public.is_admin() from anon;

create index if not exists acessos_pedido_id_idx on public.acessos(pedido_id);
create index if not exists acessos_produto_id_idx on public.acessos(produto_id);
create index if not exists acessos_subscription_id_idx on public.acessos(subscription_id);
create index if not exists assinaturas_oferta_id_idx on public.assinaturas(oferta_id);
create index if not exists assinaturas_user_id_idx on public.assinaturas(user_id);
create index if not exists depoimentos_approved_by_idx on public.depoimentos(approved_by);
create index if not exists leituras_trajetoria_pedido_id_idx on public.leituras_trajetoria(pedido_id);
create index if not exists ofertas_produto_id_idx on public.ofertas(produto_id);
create index if not exists pdf_report_jobs_result_id_idx on public.pdf_report_jobs(result_id);
create index if not exists pedidos_oferta_id_idx on public.pedidos(oferta_id);