# Cloudflare Pages — deploy

## Repositório
`canalescanorff6-source/amor-em-papel`

## Configuração recomendada
- Framework preset: **Vite**
- Build command: `npm run build`
- Build output directory: `dist`
- Node.js: 22
- Root directory: `/`

## Variáveis de ambiente
Cadastre em **Settings → Environment variables**:
- `VITE_SITE_BASE_URL`
- `VITE_WHATSAPP_NUMBER`
- `VITE_INSTAGRAM_URL`
- `VITE_SERVICE_REGION`
- `VITE_ENABLE_DEMO_FALLBACK` — use `true` em preview e `false` somente quando o catálogo real estiver pronto
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

Não cadastre `service_role` no frontend.

## Primeiro deploy
1. Conecte o GitHub ao Cloudflare Pages.
2. Selecione `canalescanorff6-source/amor-em-papel`.
3. Use as configurações acima.
4. Faça um primeiro deploy em preview.
5. Teste `/`, `/produtos`, `/produto/...`, `/carrinho`, `/checkout`, `/conta`, `/agendamento` e 404.
6. Só depois associe o domínio definitivo e atualize `VITE_SITE_BASE_URL`.

`public/_redirects` garante fallback SPA e `public/_headers` adiciona headers de segurança básicos.
