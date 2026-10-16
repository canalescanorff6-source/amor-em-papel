# Cloudflare Pages — Amor em Papel V2

## Integração GitHub

1. Cloudflare Dashboard → **Workers & Pages** → **Create** → Pages / Connect to Git.
2. Autorize o GitHub e selecione `canalescanorff6-source/amor-em-papel`.
3. Production branch: `main`.
4. Build command: `npm run build`.
5. Build output directory: `dist`.
6. Node: `22`.

## Variáveis de ambiente

Cadastre no projeto Cloudflare:

- `VITE_SITE_URL`
- `VITE_WHATSAPP_NUMBER`
- `VITE_INSTAGRAM_URL`
- `VITE_SERVICE_REGION`
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `REAL_CATALOG_READY=true` somente depois da revisão do conteúdo real.

Todas as variáveis `VITE_` são incorporadas ao frontend. Por isso **não use segredos** nelas.

## Antes de colocar domínio na cliente

Execute/local ou valide no CI:

```bash
npm run test:node
npm test
npm run typecheck
npm run test:e2e
npm run build
npm run check:release
```

`check:release` deve falhar enquanto houver dados obrigatórios ausentes. Isso é intencional.
