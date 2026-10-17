# Supabase — configuração da Amor em Papel V2

## 1. Criar projeto
Crie um projeto no Supabase e guarde a senha do banco fora do GitHub.

## 2. Aplicar banco
No SQL Editor, execute na ordem:
1. `supabase/migrations/0001_initial_schema.sql`
2. `supabase/migrations/0002_rls_policies.sql`
3. `supabase/seed.sql`

As migrations criam perfis, categorias, produtos, imagens, favoritos, carrinho, pedidos, itens, disponibilidade e agendamentos. Todas as tabelas sensíveis usam RLS.

## 3. Variáveis públicas
No Cloudflare Pages, configure:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

A chave de `service_role` **nunca** deve ser cadastrada como variável VITE nem enviada ao navegador.

## 4. Tornar a responsável admin
Primeiro crie a conta normalmente pelo Auth. Depois, usando o SQL Editor autenticado como administrador do projeto:

```sql
update public.profiles set role = 'admin' where id = '<UUID-DA-USUARIA>';
```

Nunca permita que o cliente altere o próprio `role` pelo frontend.

## 5. Storage
O bucket `product-media` é criado pela migration. Leitura é pública e escrita/exclusão exigem `public.is_admin()` via RLS.

## 6. Produção
Antes do lançamento, substitua catálogo demonstrativo, fotos e dados comerciais reais; execute `npm run check:release` com as variáveis reais.
