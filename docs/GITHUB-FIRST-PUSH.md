# Primeiro envio para o GitHub

Este projeto deve ir para um **repositório novo e exclusivo da Amor em Papel**.

## Opção A — pelo Git no computador

Depois de extrair o ZIP do projeto, abra o terminal dentro da pasta e execute:

```bash
git init
git add .
git commit -m "feat: launch Amor em Papel website"
git branch -M main
git remote add origin URL_DO_REPOSITORIO_NOVO
git push -u origin main
```

Troque `URL_DO_REPOSITORIO_NOVO` pela URL HTTPS ou SSH exibida pelo GitHub.

## Opção B — usando integração do ChatGPT com GitHub

Quando o novo repositório existir e estiver conectado com permissão de escrita, informe o nome exato no formato `usuario/repositorio`. A partir daí, os arquivos podem ser enviados diretamente para ele.

## O que deve existir no repositório

Mantenha na raiz:

- `.github/workflows/ci.yml` — validação automática;
- `assets/`, `public/`, `src/`, `scripts/`, `tests/` — código do site;
- `package.json` e `package-lock.json` — build reproduzível;
- `.env.example` — nomes das variáveis usadas no Cloudflare;
- `docs/` — instruções de entrega e deploy.

Não envie a pasta `out/` como fonte principal. Ela é gerada por `npm run build`.
