# Supabase — configuração da Amor em Papel V2

## 1. Criar projeto
Crie um projeto no Supabase e guarde a senha do banco fora do GitHub.

## 2. Aplicar banco
No SQL Editor, execute na ordem:
1. `supabase/migrations/0001_initial_schema.sql`
2. `supabase/migrations/0002_rls_policies.sql`
3. `supabase/migrations/0003_order_request_fields.sql`
4. `supabase/migrations/0004_atomic_order_requests.sql`
5. `supabase/seed.sql`

As migrations criam perfis, categorias, produtos, imagens, favoritos, carrinho, pedidos, itens, disponibilidade e agendamentos. Todas as tabelas sensíveis usam RLS. A migration 0003 preserva separadamente a quantidade solicitada e as instruções de personalização no histórico; os campos são opcionais para manter compatibilidade com pedidos antigos. A migration 0004 grava pedido e itens em uma única transação, com repetição idempotente por conta. **Valide-a num projeto de teste antes de produção**.

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
O bucket `product-media` é criado pela migration. Leitura é pública e escrita/exclusão exigem `public.is_admin()` via RLS. O painel otimiza JPG/PNG/WebP antes do upload, permite prévia, capa e exclusão; consulte [`ESTUDIO-FOTOS-V2.2.md`](ESTUDIO-FOTOS-V2.2.md).

## 6. Produção
Antes do lançamento, substitua catálogo demonstrativo, fotos e dados comerciais reais; execute `npm run check:release` com as variáveis reais.
