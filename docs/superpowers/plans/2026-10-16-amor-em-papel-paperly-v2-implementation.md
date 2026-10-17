# Amor em Papel V2 Paperly Premium Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Evoluir a V1.1.0 para um e-commerce premium React/TypeScript inspirado na organização Paperly, com catálogo, carrinho, favoritos, checkout/WhatsApp, agendamento, contas, pedidos, painel administrativo, Supabase e deploy Cloudflare/GitHub.

**Architecture:** Frontend SPA em React + TypeScript + Vite, com Tailwind CSS, Framer Motion e Lucide. Estado local persistente atende visitantes; Supabase adiciona Auth, Postgres, Storage e RLS para recursos persistentes e administrativos. Cloudflare Pages hospeda o frontend, com GitHub Actions validando lint, typecheck, testes, E2E e build antes de entrega/publicação.

**Tech Stack:** React, TypeScript, Vite, Tailwind CSS, Framer Motion, Lucide React, React Router, Zod, Supabase JS, Vitest, Testing Library, Playwright, Cloudflare Pages.

**Spec:** `docs/superpowers/specs/2026-10-16-amor-em-papel-paperly-v2-design.md`

## Global Constraints

- Preservar logo e identidade Amor em Papel; Paperly é referência de composição, não cópia de marca/conteúdo.
- Mobile-first real; desktop rico em informação, mobile reorganizado.
- Nenhum botão decorativo: toda ação visível deve funcionar.
- Não inventar dados comerciais reais; demos precisam ser identificadas como demonstração.
- WhatsApp deve aplicar `encodeURIComponent` exatamente uma vez no payload final, sem `�` ou dupla codificação.
- Número brasileiro deve ser normalizado para dígitos e receber DDI `55` quando necessário.
- Nenhuma credencial sensível no frontend ou no GitHub.
- Admin protegido por Auth + papel `admin` + RLS; service role nunca no navegador.
- Checkout não processa pagamento; finaliza por WhatsApp.
- Agendamento sem agenda transacional deve permanecer `pending`/“aguardando confirmação”.
- `prefers-reduced-motion` deve desativar movimentos não essenciais.
- Áreas de toque críticas >= 44 px.
- Cloudflare Pages: `npm run build`, saída `dist`.

## Review Focus

- Mensagens de WhatsApp com acentos/emoji/quebras precisam sobreviver encode/decode sem dupla codificação; cobrir em Task 6.
- Visitante que recarrega a página não pode perder carrinho/favoritos; cobrir em Task 5.
- Cliente autenticado nunca pode ler/alterar pedidos/perfil de outro cliente nem acessar admin; cobrir em Tasks 7–9.
- Produto sem preço/estoque/foto real não pode gerar informação comercial fictícia; cobrir em Tasks 2 e 4.
- Mobile 360 px não pode ter overflow horizontal, drawer inacessível ou CTA sobre navegação; cobrir em Task 12.

---

## File Structure

### Core app
- Create: `src/main.tsx` — bootstrap React.
- Create: `src/app/App.tsx` — router e providers.
- Create: `src/app/routes.tsx` — definição central de rotas.
- Create: `src/app/providers.tsx` — providers de auth, cart, favorites e query/state.
- Create: `src/styles/index.css` — Tailwind base + tokens globais.

### Shared UI/layout
- Create: `src/components/layout/AppShell.tsx`
- Create: `src/components/layout/DesktopSidebar.tsx`
- Create: `src/components/layout/TopHeader.tsx`
- Create: `src/components/layout/MobileNav.tsx`
- Create: `src/components/layout/RightRail.tsx`
- Create: `src/components/ui/*` — Button, Card, Badge, Drawer, Modal, Field, Skeleton, EmptyState.

### Catalog
- Create: `src/features/catalog/types.ts`
- Create: `src/features/catalog/catalog.service.ts`
- Create: `src/features/catalog/catalog.store.ts`
- Create: `src/features/catalog/ProductCard.tsx`
- Create: `src/features/catalog/ProductGrid.tsx`
- Create: `src/features/catalog/SearchBox.tsx`
- Create: `src/features/catalog/Filters.tsx`
- Create: `src/features/catalog/ProductDetail.tsx`
- Create: `src/data/demoCatalog.ts`

### Cart/favorites
- Create: `src/features/cart/cart.types.ts`
- Create: `src/features/cart/cart.storage.ts`
- Create: `src/features/cart/cart.store.tsx`
- Create: `src/features/cart/CartDrawer.tsx`
- Create: `src/features/cart/CartPage.tsx`
- Create: `src/features/favorites/favorites.store.tsx`

### Checkout/WhatsApp
- Create: `src/lib/whatsapp/normalizePhone.ts`
- Create: `src/lib/whatsapp/buildMessage.ts`
- Create: `src/lib/whatsapp/buildWaUrl.ts`
- Create: `src/features/checkout/checkout.schema.ts`
- Create: `src/features/checkout/CheckoutForm.tsx`
- Create: `src/features/checkout/CheckoutReview.tsx`
- Create: `src/features/checkout/CheckoutPage.tsx`

### Supabase/auth/orders/admin
- Create: `src/lib/supabase/client.ts`
- Create: `src/features/auth/AuthProvider.tsx`
- Create: `src/features/auth/RequireAuth.tsx`
- Create: `src/features/auth/RequireAdmin.tsx`
- Create: `src/features/account/AccountPage.tsx`
- Create: `src/features/orders/orders.service.ts`
- Create: `src/features/orders/OrdersPage.tsx`
- Create: `src/features/admin/*`
- Create: `supabase/migrations/0001_initial_schema.sql`
- Create: `supabase/migrations/0002_rls_policies.sql`
- Create: `supabase/seed.sql`

### Scheduling
- Create: `src/features/scheduling/scheduling.schema.ts`
- Create: `src/features/scheduling/scheduling.service.ts`
- Create: `src/features/scheduling/AppointmentForm.tsx`
- Create: `src/features/scheduling/AppointmentPage.tsx`

### SEO/deployment/testing
- Create: `src/lib/seo/Seo.tsx`
- Create: `public/_headers`
- Create: `public/_redirects`
- Modify: `.github/workflows/ci.yml`
- Modify: `.env.example`
- Modify: `README.md`
- Create: `docs/SUPABASE-SETUP.md`
- Modify: `docs/CLOUDFLARE-DEPLOY.md`
- Create/replace tests under `tests/unit`, `tests/components`, `tests/e2e`.

---

### Task 1: React/TypeScript/Vite foundation and test harness

**Files:**
- Modify: `package.json`
- Create: `vite.config.ts`, `tsconfig.json`, `tsconfig.app.json`, `tailwind.config.ts`, `postcss.config.js`, `index.html`
- Create: `src/main.tsx`, `src/app/App.tsx`, `src/app/routes.tsx`, `src/styles/index.css`
- Create: `tests/unit/app-smoke.test.tsx`

**Interfaces:**
- Produces: compilable React app, `App`, router entry, Tailwind tokens, Vitest/Playwright scripts.

- [ ] **Step 1:** Write `app-smoke.test.tsx` asserting brand “Amor em Papel” renders from `App`.
- [ ] **Step 2:** Run unit test and verify RED because React app does not exist.
- [ ] **Step 3:** Add React/Vite/TypeScript/Tailwind/Framer/Lucide/Router/Zod/Supabase dependencies and minimal app shell.
- [ ] **Step 4:** Run unit test, typecheck and build; expect PASS/exit 0.
- [ ] **Step 5:** Commit `feat: scaffold Amor em Papel V2 React app`.

### Task 2: Domain models, demo catalog and release-safe configuration

**Files:**
- Create: `src/features/catalog/types.ts`
- Create: `src/data/demoCatalog.ts`
- Create: `src/lib/config/siteConfig.ts`
- Create: `src/lib/config/releaseReadiness.ts`
- Create: `tests/unit/catalog-data.test.ts`, `tests/unit/release-readiness.test.ts`

**Interfaces:**
- Produces: `Product`, `Category`, `SiteConfig`, `getReleaseReadiness()`.

- [ ] **Step 1:** Add failing tests requiring demo products to carry `isDemo=true` and forbidding synthetic discount/rating claims.
- [ ] **Step 2:** Run tests; expect RED.
- [ ] **Step 3:** Implement typed demo catalog and environment-driven site config.
- [ ] **Step 4:** Run tests; expect PASS.
- [ ] **Step 5:** Commit `feat: add safe catalog domain and release config`.

### Task 3: Premium Paperly-inspired responsive shell

**Files:**
- Create: layout components and shared UI listed above.
- Create: `tests/components/app-shell.test.tsx`
- Create: `tests/e2e/responsive-shell.spec.ts`

**Interfaces:**
- Consumes: `SiteConfig` from Task 2.
- Produces: `AppShell` with sidebar/header/mobile nav/right rail breakpoints.

- [ ] **Step 1:** Write failing component tests for desktop navigation labels, mobile controls and accessible names.
- [ ] **Step 2:** Run tests; expect RED.
- [ ] **Step 3:** Implement responsive shell matching Amor em Papel palette and Paperly information architecture.
- [ ] **Step 4:** Run component tests; expect PASS.
- [ ] **Step 5:** Add Playwright viewport assertions for 360/390/430/768/1024/1280/1536 with no horizontal overflow.
- [ ] **Step 6:** Run E2E; expect PASS.
- [ ] **Step 7:** Commit `feat: build premium responsive commerce shell`.

### Task 4: Home, catalog, search, filters and product detail

**Files:**
- Create: catalog components/services/store.
- Create: route pages for `/`, `/produtos`, `/categoria/:slug`, `/produto/:slug`, `/promocoes`, `/mais-vendidos`, `/novidades`, `/personalizados`, `/inspiracoes`.
- Create: `tests/unit/catalog-search.test.ts`, `tests/components/catalog.test.tsx`, `tests/e2e/catalog.spec.ts`.

**Interfaces:**
- Consumes: typed catalog from Task 2, shell from Task 3.
- Produces: searchable/filterable/sortable catalog and product detail.

- [ ] **Step 1:** Write failing tests for text/category/price/personalizable filters and stable sort.
- [ ] **Step 2:** Run unit tests; expect RED.
- [ ] **Step 3:** Implement catalog selectors/service.
- [ ] **Step 4:** Run unit tests; expect PASS.
- [ ] **Step 5:** Write failing component/E2E tests for hero, category rails, demo labels, detail navigation and empty state.
- [ ] **Step 6:** Implement Home and catalog UI with skeletons/microinteractions and reduced-motion handling.
- [ ] **Step 7:** Run component/E2E tests; expect PASS.
- [ ] **Step 8:** Commit `feat: add premium catalog and product discovery`.

### Task 5: Persistent cart and favorites

**Files:**
- Create: cart/favorites files listed above.
- Create: `tests/unit/cart.test.ts`, `tests/unit/storage.test.ts`, `tests/components/cart-drawer.test.tsx`, `tests/e2e/cart-favorites.spec.ts`.

**Interfaces:**
- Produces: `CartProvider`, `useCart()`, `FavoritesProvider`, `useFavorites()`.

- [ ] **Step 1:** Write failing tests for add/remove/update/subtotal, customization snapshots and invalid localStorage recovery.
- [ ] **Step 2:** Run tests; expect RED.
- [ ] **Step 3:** Implement cart state and versioned persistence.
- [ ] **Step 4:** Run tests; expect PASS.
- [ ] **Step 5:** Write failing E2E test: add product, reload, cart/favorite state survives.
- [ ] **Step 6:** Implement drawers/pages and feedback states.
- [ ] **Step 7:** Run E2E; expect PASS.
- [ ] **Step 8:** Commit `feat: add persistent cart and favorites`.

### Task 6: Checkout review and WhatsApp encoding

**Files:**
- Create: WhatsApp and checkout files listed above.
- Create: `tests/unit/whatsapp.test.ts`, `tests/unit/checkout-validation.test.ts`, `tests/components/checkout.test.tsx`, `tests/e2e/checkout-whatsapp.spec.ts`.

**Interfaces:**
- Consumes: cart from Task 5, `SiteConfig.whatsappNumber` from Task 2.
- Produces: `normalizeBrazilPhone`, `buildOrderMessage`, `buildWhatsAppUrl`, checkout review flow.

- [ ] **Step 1:** Write failing unit tests for numbers with/without `55`, punctuation stripping, invalid short numbers, accents, emoji, newlines and literal `%`.
- [ ] **Step 2:** Run tests; expect RED.
- [ ] **Step 3:** Implement phone normalization and one-time `encodeURIComponent` URL generation.
- [ ] **Step 4:** Run tests; expect PASS and assert decoded `text` equals original message with no `�`.
- [ ] **Step 5:** Write failing component/E2E tests for validation, conditional address, review-before-send and full cart content in message.
- [ ] **Step 6:** Implement form/review/WhatsApp open behavior for mobile and desktop.
- [ ] **Step 7:** Run E2E; expect PASS.
- [ ] **Step 8:** Commit `feat: add checkout review and robust WhatsApp orders`.

### Task 7: Supabase schema, Auth and RLS

**Files:**
- Create: migrations, seed, Supabase client/auth guard files.
- Create: `tests/unit/supabase-config.test.ts`, `tests/unit/rls-contract.test.ts`, `tests/components/auth-guards.test.tsx`.

**Interfaces:**
- Produces: DB schema from spec, `AuthProvider`, `RequireAuth`, `RequireAdmin`.

- [ ] **Step 1:** Write failing contract tests that inspect migration SQL for required tables, constraints, RLS enablement and absence of service-role secrets.
- [ ] **Step 2:** Run tests; expect RED.
- [ ] **Step 3:** Implement schema for profiles/categories/products/images/favorites/orders/order_items/appointments/availability and secure storage bucket policies.
- [ ] **Step 4:** Implement RLS: customer self-access; admin via profile role; public product/category reads only active rows.
- [ ] **Step 5:** Run contract tests; expect PASS.
- [ ] **Step 6:** Write failing auth guard tests for customer blocked from `/admin` and unauthenticated redirected to login/account flow.
- [ ] **Step 7:** Implement Supabase client and guards using only publishable/anon key.
- [ ] **Step 8:** Run tests; expect PASS.
- [ ] **Step 9:** Commit `feat: add Supabase auth schema and RLS security`.

### Task 8: Customer account, order history and favorites sync

**Files:**
- Create: account/orders services/pages.
- Modify: favorites/cart providers for authenticated sync.
- Create: `tests/unit/favorite-merge.test.ts`, `tests/components/account-orders.test.tsx`.

**Interfaces:**
- Consumes: auth from Task 7, cart/favorites from Task 5.
- Produces: account profile, own-order history, local→account favorites merge without duplicates.

- [ ] **Step 1:** Write failing tests for deterministic merge and ownership filtering.
- [ ] **Step 2:** Run tests; expect RED.
- [ ] **Step 3:** Implement services and pages with loading/error/empty states.
- [ ] **Step 4:** Run tests; expect PASS.
- [ ] **Step 5:** Commit `feat: add customer account and order history`.

### Task 9: Protected admin CRUD and media

**Files:**
- Create: `src/features/admin/AdminLayout.tsx`, `AdminDashboard.tsx`, `ProductsAdminPage.tsx`, `OrdersAdminPage.tsx`, `ScheduleAdminPage.tsx`, forms/services.
- Create: `tests/components/admin.test.tsx`, `tests/e2e/admin.spec.ts`.

**Interfaces:**
- Consumes: `RequireAdmin`, Supabase tables/storage.
- Produces: product/category CRUD, image upload metadata, order status updates, availability management.

- [ ] **Step 1:** Write failing admin guard/CRUD UI tests.
- [ ] **Step 2:** Run tests; expect RED.
- [ ] **Step 3:** Implement admin UI and Supabase calls; never expose service role.
- [ ] **Step 4:** Add validation and explicit destructive confirmations.
- [ ] **Step 5:** Run component tests; expect PASS.
- [ ] **Step 6:** Add E2E mocked/local harness proving customer cannot access admin and admin flows render/update expected state.
- [ ] **Step 7:** Run E2E; expect PASS.
- [ ] **Step 8:** Commit `feat: add protected admin commerce console`.

### Task 10: Appointment request workflow

**Files:**
- Create: scheduling files listed above.
- Create: `tests/unit/scheduling.test.ts`, `tests/components/appointment.test.tsx`, `tests/e2e/appointment.spec.ts`.

**Interfaces:**
- Consumes: WhatsApp from Task 6, availability from Supabase Task 7.
- Produces: pending-only appointment requests and confirmation message.

- [ ] **Step 1:** Write failing tests that selected time never becomes `confirmed` automatically.
- [ ] **Step 2:** Run tests; expect RED.
- [ ] **Step 3:** Implement slot rendering, validation, pending submission and WhatsApp review.
- [ ] **Step 4:** Run unit/component/E2E; expect PASS.
- [ ] **Step 5:** Commit `feat: add pending-confirmation appointment requests`.

### Task 11: SEO, accessibility, GitHub CI and Cloudflare delivery

**Files:**
- Create: `src/lib/seo/Seo.tsx`
- Modify: `public/_headers`, `public/_redirects`, `.github/workflows/ci.yml`, `.env.example`, `README.md`, `docs/CLOUDFLARE-DEPLOY.md`
- Create: `docs/SUPABASE-SETUP.md`, `scripts/release-check.mjs`, `tests/unit/seo.test.ts`, `tests/unit/release-check.test.ts`.

**Interfaces:**
- Produces: CI/build/deploy contracts and production-readiness guard.

- [ ] **Step 1:** Write failing tests for preview `noindex`, canonical/OG, release blockers and secure headers.
- [ ] **Step 2:** Run tests; expect RED.
- [ ] **Step 3:** Implement SEO component, release check, env docs and Cloudflare files.
- [ ] **Step 4:** Update CI to run install, lint, typecheck, unit/component, E2E smoke and build.
- [ ] **Step 5:** Run tests/build; expect PASS.
- [ ] **Step 6:** Commit `chore: harden SEO CI and Cloudflare delivery`.

### Task 12: Final QA, accessibility and release package

**Files:**
- Create/modify: Playwright suites, `CHANGELOG.md`, delivery docs.

**Interfaces:**
- Consumes: all previous tasks.
- Produces: verified V2 release candidate and publish checklist.

- [ ] **Step 1:** Run full unit/component suite; require 0 failures.
- [ ] **Step 2:** Run full Playwright flows for catalog, cart, favorites, checkout, auth guards, admin, scheduling and 404.
- [ ] **Step 3:** Run responsive viewports 360/390/430/768/1024/1280/1536; require no horizontal overflow and usable drawers/CTAs.
- [ ] **Step 4:** Verify keyboard focus, labels, reduced motion and contrast-critical controls.
- [ ] **Step 5:** Run `npm run build` and `npm run check:release`; preview may intentionally fail only on missing real client data and must report exact blockers.
- [ ] **Step 6:** Update changelog/README with V2 architecture and setup order: GitHub → Supabase → Cloudflare → real content → release check.
- [ ] **Step 7:** Commit `release: prepare Amor em Papel V2 premium`.

## Self-Review

- Spec coverage: all public routes, cart, favorites, checkout/WhatsApp, scheduling, auth, orders, admin, Supabase RLS, SEO, GitHub/Cloudflare and QA are assigned to tasks.
- Step scan: each task follows RED→GREEN where behavior/code changes are involved; config/documentation changes are verified by contract/build checks.
- Type consistency: catalog/cart/auth/admin interfaces are introduced before consumers.
- Review Focus coverage: WhatsApp in Task 6; persistence Task 5; authorization Tasks 7–9; demo data Tasks 2/4; mobile overflow Task 12.
- Scope: payment online, automatic carrier shipping and invoicing remain outside V2 as required.
