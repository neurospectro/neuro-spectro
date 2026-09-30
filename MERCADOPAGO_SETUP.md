# Mercado Pago — configuração final do NeuroSpectro

O código do Checkout Transparente usa a Orders API + Payment Brick.

## O que já está implementado

- Relatório Completo: R$ 24,90
- Relatório PDF: R$ 14,90 como upsell do Relatório Completo
- Comunidade de Apoio: 6x R$ 14,90, total R$ 89,40
- Criação de pedidos no backend
- Idempotência
- Pix e meios suportados pelo Payment Brick
- Webhook de Order
- Validação HMAC do webhook
- Registro de pedidos/pagamentos
- Liberação automática do acesso após confirmação
- Acesso por tempo indeterminado com `expires_at = NULL`
- RLS para impedir que o cliente altere o próprio acesso

## Variáveis do frontend

No Lovable/hosting:

```env
VITE_SUPABASE_URL=https://SEU-PROJETO.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=SUA_CHAVE_PUBLICA_SUPABASE
VITE_MERCADOPAGO_PUBLIC_KEY=SUA_PUBLIC_KEY_DO_MERCADO_PAGO
```

A Public Key pode estar no frontend. O Access Token do Mercado Pago NÃO pode.

## Secrets do Supabase Edge Functions

No Supabase, em Edge Functions > Secrets, configure:

```
MERCADOPAGO_ACCESS_TOKEN=SEU_ACCESS_TOKEN
MERCADOPAGO_WEBHOOK_SECRET=SUA_CHAVE_SECRETA_DO_WEBHOOK
```

Não coloque esses valores no GitHub, no frontend ou no chat.

## Deploy das funções

Depois de conectar o projeto Supabase:

```bash
supabase functions deploy process-payment
supabase functions deploy mercadopago-webhook
```

A URL do webhook será:

```
https://SEU-PROJETO.supabase.co/functions/v1/mercadopago-webhook
```

## Mercado Pago

Em Mercado Pago > Sua integração > Webhooks:

1. Configure a URL HTTPS acima.
2. Selecione o evento **Order**.
3. Salve.
4. Copie a chave secreta gerada para o secret `MERCADOPAGO_WEBHOOK_SECRET`.
5. Use o modo de teste primeiro.

## Banco

Execute as migrations do diretório `supabase/migrations` em ordem.

A migration `20260930_mercadopago_orders.sql` cria as garantias necessárias para idempotência e para acessos sem data de expiração.

## Importante sobre o Access Token

Tokens que começam com `APP_USR` são Access Tokens do Mercado Pago. Eles são credenciais privadas de backend e não devem ser colocados em `VITE_*` nem no código público.

A Public Key é a credencial usada no frontend para inicializar o Mercado Pago.

## Fluxo

```
Cliente autenticado
      ↓
Checkout NeuroSpectro
      ↓
Payment Brick
      ↓
Supabase Edge Function
      ↓
Mercado Pago Orders API
      ↓
Pagamento
      ↓
Webhook assinado
      ↓
Supabase
      ↓
Pedido pago + acesso liberado
```

O frontend nunca é a fonte de verdade para liberar produto.
