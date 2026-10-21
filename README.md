# Amor em Papel — V2 Premium

E-commerce/catálogo premium da **Amor em Papel — Papelaria Personalizada**, inspirado na organização da referência Paperly, porém com identidade própria da marca.

## O que já está implementado

- React + TypeScript + Vite.
- Tailwind CSS no pipeline e CSS autoral responsivo.
- Framer Motion e Lucide Icons.
- Layout desktop em três regiões: sidebar, conteúdo, rail do carrinho.
- Tablet/mobile reorganizados com menu, busca e navegação inferior.
- Catálogo, categorias, busca, filtros, ordenação, detalhes e personalizados.
- Carrinho e favoritos persistentes, com armazenamento isolado por conta autenticada (a cesta do visitante continua independente).
- Permissões administrativas revalidadas por identidade após entrar ou trocar de conta.
- Checkout com tela de conferência antes do WhatsApp.
- WhatsApp brasileiro normalizado e mensagem codificada uma única vez com `encodeURIComponent`.
- Solicitação de atendimento/agendamento sempre pendente até confirmação humana.
- Supabase Auth, Postgres, Storage e RLS preparados.
- Conta, histórico de pedidos e rotas administrativas protegidas.
- Admin para visão geral, produtos, pedidos e agenda.
- Estúdio de fotos administrativo: otimização local, prévia, escolha de capa, exclusão e tratamento de falhas de Storage/metadata ([guia V2.2](docs/ESTUDIO-FOTOS-V2.2.md)).
- SEO básico, 404, headers Cloudflare, CI e testes.

## Dados demonstrativos

Nenhum preço, desconto, avaliação, estoque, telefone ou portfólio real foi inventado. O catálogo inicial está marcado como **Demonstração** e usa placeholders. `npm run check:release` bloqueia configurações incompletas e o modo de demonstração ativo; **não verifica o catálogo nem o backend em produção**. Fotos, produtos e preços reais precisam de conferência no Supabase antes de liberar o site.

## Executar localmente

```bash
npm install
cp .env.example .env.local
npm run dev
```

## Verificação

```bash
npm run typecheck
npm run test:unit
npm run build
npm run test:e2e
```

## Backend

Leia [`docs/SUPABASE-SETUP.md`](docs/SUPABASE-SETUP.md).

## Cloudflare

Leia [`docs/CLOUDFLARE-DEPLOY.md`](docs/CLOUDFLARE-DEPLOY.md).

## Ordem de lançamento

1. GitHub/CI verde.
2. Supabase criado + migrations + RLS.
3. Cloudflare Pages conectado.
4. WhatsApp, Instagram, região e domínio reais.
5. Produtos/fotos/preços/estoques reais.
6. Conta admin validada.
7. `npm run check:release` sem bloqueadores.
8. Domínio definitivo e publicação.
