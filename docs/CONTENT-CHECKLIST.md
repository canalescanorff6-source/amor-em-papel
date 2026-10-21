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
npm install
npm run check:source
npm run typecheck
npm run test:unit
npm run build
npm run test:e2e
npm run check:release
```

- [ ] Todos os testes estão verdes.
- [ ] Não há overflow horizontal em 360, 390, 430, 768, 1024, 1280 e 1536 px.
- [ ] Não há links quebrados.
- [ ] Dados reais configurados nas variáveis `VITE_*` do Cloudflare Pages (`.env.example` é somente modelo).
- [ ] `VITE_SITE_BASE_URL` configurada com a URL HTTPS final.
- [ ] `VITE_WHATSAPP_NUMBER` configurada com telefone oficial brasileiro.
- [ ] `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` do projeto correto (nunca uma chave `service_role`).
- [ ] `VITE_ENABLE_DEMO_FALLBACK=false` somente após cadastrar e revisar catálogo real.
- [ ] Build Vite gerado em `dist/`, usando `npm run build`.
- [ ] Migrações Supabase `0001` a `0004` aplicadas e RLS testada com duas contas reais.
- [ ] Painel de fotos V2.2 testado com produto real, seleção de capa e exclusão.
- [ ] Nenhum placeholder é apresentado como trabalho real.
