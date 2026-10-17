# Checklist de conteúdo real — Amor em Papel

Use este checklist antes de transformar a versão demonstrativa em site público da cliente.

## Contatos e identidade comercial

- [ ] Número oficial do WhatsApp. O sistema aceita DDI + DDD + telefone ou apenas DDD + telefone brasileiro.
- [ ] URL oficial do Instagram.
- [ ] Cidade/região realmente atendida.
- [ ] Domínio final do site (`https://...`).
- [ ] Nome da responsável pela marca, somente se ela quiser exibi-lo.
- [ ] Texto curto de apresentação/história da Amor em Papel aprovado pela cliente.

## Catálogo real

- [ ] Fotografias reais e autorizadas dos trabalhos.
- [ ] Nome correto de cada produto/modelo.
- [ ] Categoria de cada produto.
- [ ] Descrição curta e descrição completa.
- [ ] Opções reais de personalização disponíveis.
- [ ] Texto alternativo descritivo para cada foto.
- [ ] Preço ou “a partir de” somente se a cliente quiser divulgar.
- [ ] Prazo de produção somente se existir uma política real e atual.
- [ ] Informação de retirada/entrega somente depois de confirmada.

## Inspirações e prova social

- [ ] Trocar todas as artes em `public/placeholders/` por conteúdo real antes de apresentá-las como portfólio.
- [ ] Remover `isPlaceholder: true` apenas dos itens que foram realmente substituídos e validados.
- [ ] Inserir depoimentos somente com texto verdadeiro e autorização da cliente.
- [ ] Não criar avaliações, estrelas, quantidade de pedidos ou números de clientes sem evidência real.

## Revisão comercial

- [ ] Testar o botão de WhatsApp em um celular real.
- [ ] Confirmar que a mensagem de orçamento pede nome, idade, tema, data da festa, quantidade e referência.
- [ ] Confirmar o perfil correto do Instagram.
- [ ] Revisar preços e prazos com a cliente imediatamente antes da publicação.
- [ ] Revisar política de encomenda, alterações, cancelamento, retirada e entrega, caso essas regras sejam publicadas.

## Revisão visual e legal

- [ ] Confirmar autorização de uso da logo e de todas as fotos.
- [ ] Confirmar que personagens, imagens e artes de terceiros usados nas fotos são responsabilidade do conteúdo fornecido pela cliente.
- [ ] Verificar recortes, nitidez e orientação das fotos em celular e desktop.
- [ ] Revisar ortografia de nomes, idades, temas e textos.
- [ ] Revisar a Política de Privacidade caso futuramente sejam adicionados formulários, analytics, pixels, cookies, login ou pagamentos.

## Verificação técnica final

```bash
npm ci
npm run check
npm run check:release
```

- [ ] Todos os testes estão verdes.
- [ ] Não há overflow horizontal em 360, 390, 430, 768, 1024, 1280 e 1536 px.
- [ ] Não há links quebrados.
- [ ] Os dados finais estão em `src/config.mjs` ou nas variáveis `SITE_*` do Cloudflare.
- [ ] `SITE_BASE_URL`/`baseUrl` está configurado com o domínio final.
- [ ] `out/sitemap.xml` contém o domínio final após novo build.
- [ ] Nenhum placeholder é apresentado como trabalho real.
