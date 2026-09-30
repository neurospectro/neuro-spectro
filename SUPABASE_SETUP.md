# NeuroSpectro — configuração do Supabase

## 1. Criar o projeto

No Supabase, crie um projeto para o NeuroSpectro.

Depois copie:
- Project URL
- Publishable key

Nunca coloque a `service_role` key no frontend.

## 2. Variáveis do frontend

Configure no ambiente do Lovable/deploy:

```
VITE_SUPABASE_URL=https://SEU-PROJETO.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=SUA_CHAVE_PUBLICA
```

O projeto já possui `src/lib/supabase.ts`, que lê essas variáveis.

## 3. Aplicar as migrations

Abra o SQL Editor do Supabase e execute os arquivos em ordem cronológica da pasta `supabase/migrations`.

A migration `20260930_supabase_foundation.sql`:
- cria `public.usuarios`;
- ativa RLS;
- cria o perfil automaticamente quando um usuário entra pelo Supabase Auth;
- permite acesso indefinido com `expires_at = null`;
- cria os produtos e ofertas atuais do NeuroSpectro;
- não cria nenhum segredo no banco.

## 4. Auth

Em Authentication > URL Configuration, configure a URL pública do NeuroSpectro e a URL de redirecionamento usada pelo Magic Link.

O projeto já possui a rota `/login` e utiliza Supabase Auth.

## 5. Segurança

Mantenha RLS habilitado nas tabelas que contêm dados pessoais ou resultados.

Nunca use:
- service_role key no navegador;
- senha do banco no frontend;
- dados clínicos/sensíveis em ferramentas de anúncios;
- confirmação de pagamento baseada apenas no frontend.

Pagamento e liberação de acesso devem ser confirmados por webhook no servidor.

## 6. O que ainda depende de configuração externa

A conexão real com um projeto Supabase não pode ser concluída apenas pelo GitHub: é necessário criar o projeto no painel do Supabase e fornecer/configurar as variáveis de ambiente no ambiente de execução.

Depois disso, o próximo bloco técnico é:
1. persistir avaliação e respostas;
2. criar dashboard do usuário;
3. integrar gateway de pagamento;
4. processar webhook;
5. liberar relatório/PDF/comunidade por `acessos`;
6. criar área administrativa protegida.
