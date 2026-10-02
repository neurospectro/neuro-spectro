# Geração gratuita de PDF com IA

O NeuroSpectro usa uma Edge Function do Supabase para gerar o PDF sob demanda. O texto editorial é produzido por Cloudflare Workers AI e o PDF é montado por código com pdf-lib.

## Secrets do Supabase

Configure estes secrets na Edge Function:

- CLOUDFLARE_ACCOUNT_ID
- CLOUDFLARE_API_TOKEN
- CLOUDFLARE_AI_MODEL (opcional; padrão: @cf/meta/llama-3.1-8b-instruct)

O token do Cloudflare deve ter as permissões Workers AI Read e Workers AI Edit.

## Custo

Workers AI possui uma franquia gratuita diária de 10.000 Neurons. O consumo é reiniciado diariamente. Acima da franquia, o uso exige plano pago.

O PDF em si não usa uma API externa de PDF: ele é montado dentro da Edge Function.

## Fluxo

1. Usuário com acesso ao produto PDF abre /relatorio-pdf.
2. Clica em Gerar meu PDF.
3. generate-pdf-report valida autenticação e acesso ao produto.
4. A função busca o resultado mais recente do próprio usuário.
5. Cloudflare Workers AI produz somente a narrativa editorial.
6. O código gera o PDF e grava em Storage privado.
7. Uma signed URL temporária é devolvida.
8. Se o PDF já existir, não há nova chamada à IA.
9. Uma nova geração só ocorre quando o usuário solicitar explicitamente.

Nunca coloque o token do Cloudflare no frontend.
