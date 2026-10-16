# Supabase — configuração da Amor em Papel V2

1. Crie um projeto Supabase para a cliente.
2. Em **SQL Editor**, execute na ordem:
   - `supabase/migrations/0001_initial_schema.sql`
   - `supabase/migrations/0002_rls_policies.sql`
   - `supabase/migrations/0003_order_rpc.sql`
   - opcionalmente `supabase/seed.sql` para as categorias iniciais.
3. Em **Authentication > URL Configuration**, adicione a URL do Cloudflare e o domínio definitivo.
4. Copie apenas a **Project URL** e a chave pública **anon/publishable** para o Cloudflare (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`).
5. Nunca copie a `service_role` para GitHub, `.env`, navegador ou Cloudflare Pages frontend.
6. Crie a conta da responsável pela loja e, no SQL Editor, promova manualmente o perfil autorizado:

```sql
update public.profiles set role = 'admin' where id = '<UUID-DA-USUARIA>';
```

7. Teste com duas contas: uma cliente deve ser redirecionada de `/admin`; a admin deve acessar o painel.

## Storage

A migration cria o bucket público `product-media`. Leitura é pública; upload/update/delete são permitidos apenas a usuários com `profiles.role = 'admin'` via RLS.
