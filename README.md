# Amor em Papel — V2 Premium

E-commerce/catalogo premium para **Amor em Papel — Papelaria Personalizada**, inspirado na organização visual Paperly e adaptado à identidade própria da marca.

## Stack

React + TypeScript + Vite + Tailwind CSS + Framer Motion + Lucide + React Router + Zod + Supabase + Playwright, preparado para GitHub e Cloudflare Pages.

## Funcionalidades

- Home premium responsiva, categorias e vitrines.
- Catálogo com busca, filtros e ordenação.
- Produto detalhado e demonstrações explicitamente identificadas.
- Carrinho e favoritos persistentes no navegador.
- Checkout com conferência e WhatsApp codificado com `encodeURIComponent` uma única vez.
- Conta, pedidos e favoritos sincronizados quando Supabase estiver conectado.
- Agendamento como **solicitação pendente**, nunca confirmação automática.
- Painel administrativo protegido por Auth + `admin` + RLS.
- Cadastro de produtos, imagens, status de pedidos e disponibilidade.
- SEO/OG, acessibilidade, CSP/headers e CI.

## Rodar

```bash
npm install
cp .env.example .env.local
npm run dev
```

## Validar

```bash
npm run test:node
npm test
npm run typecheck
npm run test:e2e
npm run build
npm run check:release:preview
```

## Ordem de configuração para entrega

1. GitHub: este repositório + CI verde.
2. Supabase: migrations, Auth, admin e Storage (`docs/SUPABASE-SETUP.md`).
3. Cloudflare Pages: conectar o GitHub (`docs/CLOUDFLARE-DEPLOY.md`).
4. Cadastrar WhatsApp, Instagram, região, domínio e produtos/fotos reais.
5. Definir `REAL_CATALOG_READY=true` somente após revisão do catálogo real.
6. Rodar `npm run check:release`; somente 0 blockers significa produção pronta.

## Dados demonstrativos

A aplicação começa com modelos de demonstração para permitir QA visual. Eles não representam preço, desconto, avaliação, estoque ou trabalhos reais da cliente.
