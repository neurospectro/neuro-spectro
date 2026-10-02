# Fase 01/05 — Auditoria técnica + Central de Integrações

Nada de checkout, perguntas, pontuação ou análise será reconstruído. Só auditoria, correções pontuais de segurança e uma nova área no Admin.

## 1. Auditoria (somente leitura, com evidência)
Ler e conferir cada peça existente:
- Código: `src/lib/supabase.ts`, `mercadopago.ts`, `security-captcha.tsx`, rotas `checkout`, `login`, `admin`, `dashboard`, `relatorio-*`, `pos-compra`.
- Backend: 3 funções (`process-payment`, `mercadopago-webhook`, `notify-trajectory-submission`) e 9 migrations (tabelas, RLS, grants, idempotência).
- GitHub Actions (`production-build`, `deploy-supabase-functions`).
- Procurar: segredos no frontend, `catch(() => {})` silencioso, duplicidades (ex.: dois clientes Supabase), Turnstile validado só no navegador, IA e e-mail (verificar se existem de fato).
Status só é marcado "funcionando" com prova (teste real ou resposta do servidor); o resto fica "não verificado" ou "depende de configuração externa".

## 2. Correções de segurança encontradas
- Webhook: hoje aceita como "simulado" qualquer notificação cujo external_reference não comece com `ns_` antes de consultar o Mercado Pago — manter só depois da assinatura (já ocorre) e registrar no log de eventos.
- Garantir que Turnstile seja validado no servidor em `process-payment` (secret `TURNSTILE_SECRET_KEY`) e no login (via configuração de captcha do Supabase Auth).
- Trocar falhas silenciosas em operações críticas (pagamento, salvamento de avaliação, acesso) por erro registrado e mensagem visível.
- Confirmar que pedidos/acessos não podem ser alterados pelo cliente (RLS).

## 3. Central de Integrações no Admin
Nova aba no Admin com um cartão por serviço: Supabase, Auth, Database, Storage, Edge Functions, Mercado Pago, Webhook, Turnstile, IA, E-mail, Deploy. Cada cartão mostra status, última verificação, último erro, data/hora, ambiente (teste/produção) e função.
- Nova função `integrations-health` (somente admin, verificado por papel no servidor) que roda testes seguros: ping no banco, listagem de Storage, presença dos secrets (sem revelar valores), consulta de leitura no Mercado Pago (`/users/me`), validação Turnstile com token de teste, último evento de webhook recebido, IA/e-mail apenas "configurado / não configurado" (envio de e-mail só com confirmação explícita).
- Nova tabela `integration_checks` (histórico dos testes; leitura só para admin).
- Testes nunca cobram, liberam produto nem alteram dados reais.

## 4. Entrega
Build + typecheck, abrir a Central no navegador, e relatório final nas seções: IMPLEMENTADO, CONFIGURADO, TESTADO, PENDENTE, SECRET NECESSÁRIO, DEPLOY NECESSÁRIO, RISCO IDENTIFICADO.

## Observação importante
O Supabase deste projeto é externo (não gerenciado pelo Lovable). Novas migrations e funções ficam no código, mas só passam a valer depois de aplicadas no seu Supabase (SQL Editor) e publicadas (GitHub Actions ou CLI). O relatório dirá exatamente o que aplicar.
