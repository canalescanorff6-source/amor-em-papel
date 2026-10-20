# Amor em Papel V2 — E-commerce Premium inspirado no layout Paperly

Data: 2026-10-16
Status: Especificação de arquitetura e UX para aprovação antes da implementação

## 1. Objetivo

Evoluir o site **Amor em Papel — Papelaria Personalizada** para uma experiência de e-commerce premium, inspirada na organização visual da referência Paperly enviada pelo cliente, mas com identidade própria da Amor em Papel.

O projeto deve preservar a marca, a logo e a paleta da Amor em Papel. A referência Paperly orienta composição, densidade visual, hierarquia, vitrines, cartões e experiência de navegação; não serão copiados logotipo, textos, fotografias, ícones proprietários ou identidade da Paperly.

O resultado deve funcionar como uma papelaria brasileira com foco em:

- papelaria escolar e criativa;
- materiais de escritório;
- cadernos e agendas;
- canetas e marcadores;
- topos de bolo;
- lembrancinhas;
- caixas/embalagens;
- decoração de festas;
- personalizados;
- presentes criativos.

O fluxo de compra principal continuará sendo **carrinho + conferência + envio do pedido/orçamento pelo WhatsApp**, sem pagamento online nesta versão.

## 2. Princípios de produto

1. **Mobile first de verdade.** O layout desktop pode ser rico em informação; no celular, a experiência será reorganizada, não apenas reduzida.
2. **Nenhum botão decorativo.** Toda ação visível terá comportamento implementado.
3. **Dados comerciais reais não serão inventados.** Produtos demonstrativos serão marcados como demonstração.
4. **WhatsApp confiável.** Mensagens usarão `encodeURIComponent`, normalização de número brasileiro e testes contra caracteres quebrados.
5. **Acessibilidade e desempenho.** Respeitar `prefers-reduced-motion`, foco visível, áreas de toque >= 44 px e carregamento progressivo.
6. **Segurança por padrão.** Rotas administrativas protegidas, RLS no banco, validação de entrada e nenhuma credencial exposta no frontend.

## 3. Direção visual

### 3.1 Referência Paperly

No desktop, a composição seguirá a lógica visual da referência:

- navegação lateral/esquerda compacta;
- região central como conteúdo principal;
- área lateral direita para carrinho e módulos de apoio quando houver largura suficiente;
- banner/hero horizontal de alta presença;
- categorias em chips/círculos visuais;
- vitrines por seções com cards compactos;
- blocos de benefícios e inspiração;
- bastante branco, divisões suaves e cartões arredondados.

A estrutura será **adaptativa**, não uma cópia pixel a pixel.

### 3.2 Identidade Amor em Papel

Paleta derivada da logo:

- Rosa principal: `#F5619C`
- Rosa pastel: `#F9D8E7`
- Azul-claro: `#87D7F6`
- Turquesa suave: `#B9EFF2`
- Amarelo: `#FBCB69`
- Marrom profundo: `#472B24`
- Branco: `#FFFFFF`
- Fundo suave: `#FFF9FC`
- Grafite: `#24242A`
- Cinza de apoio: `#6E6E78`

A logo da Amor em Papel será o elemento de marca principal. Formas de coração, papel recortado, lápis, pequenas estrelas e contornos arredondados serão usados com moderação.

### 3.3 Tipografia

- Fonte de interface: sans-serif moderna, legível e com boa performance.
- Títulos especiais podem usar uma fonte de display delicada em trechos curtos, sem comprometer leitura.
- Texto de produto e preço sempre em tipografia limpa e objetiva.

## 4. Arquitetura de layout

### Desktop >= 1180 px

Layout em três regiões:

1. **Sidebar fixa/pegajosa à esquerda**
   - Logo compacta
   - Início
   - Categorias
   - Promoções
   - Mais vendidos
   - Novidades
   - Personalizados
   - Inspirações
   - Meus pedidos
   - Favoritos
   - Atendimento
   - Carrinho
   - Configurações/conta, quando autenticado

2. **Conteúdo central**
   - Barra de pesquisa
   - Hero
   - Categorias
   - Vitrines
   - Inspiração
   - Conteúdo institucional

3. **Rail direito contextual**
   - Carrinho rápido
   - Produtos relacionados
   - Benefícios
   - CTA de WhatsApp
   - Some em larguras menores para não esmagar o conteúdo

### Tablet 768–1179 px

- Sidebar vira cabeçalho compacto.
- Carrinho lateral abre como drawer.
- Grid central de 2–3 colunas.
- Categorias horizontais roláveis.

### Mobile <= 767 px

- Header compacto com logo, busca, favoritos e carrinho.
- Navegação inferior opcional com Início, Categorias, Buscar, Favoritos e Carrinho.
- Categorias em trilho horizontal.
- Produtos em 2 colunas quando possível e 1 coluna em telas muito estreitas.
- Carrinho em drawer full-height.
- CTA do WhatsApp acessível sem cobrir navegação.
- Menos módulos simultâneos na Home; priorizar busca, categorias, destaques e personalizados.

## 5. Rotas públicas

- `/` — Home premium
- `/categorias` — todas as categorias
- `/categoria/:slug` — listagem por categoria
- `/produtos` — catálogo completo
- `/produto/:slug` — detalhe do produto
- `/promocoes` — ofertas reais/demonstrativas identificadas
- `/mais-vendidos` — ranking real ou demonstrativo identificado
- `/novidades` — itens recentes
- `/personalizados` — itens personalizáveis
- `/inspiracoes` — projetos e referências
- `/favoritos` — favoritos do visitante/usuário
- `/carrinho` — carrinho completo
- `/checkout` — conferência + formulário + WhatsApp
- `/agendamento` — solicitação de atendimento
- `/meus-pedidos` — pedidos/solicitações do usuário autenticado
- `/conta` — perfil do usuário
- `/atendimento` — canais e FAQ
- `/sobre` — marca
- `/privacidade` — política
- 404 personalizada

## 6. Home

### 6.1 Header/pesquisa

- Busca com autocomplete por nome/categoria/tag.
- Ícone de favoritos com contagem.
- Carrinho com contagem e subtotal.
- Acesso à conta.

### 6.2 Hero

Hero inspirado na referência, porém com a identidade da Amor em Papel:

- fundo pastel azul/rosa;
- título: foco em papelaria criativa e personalizados;
- CTA primário para produtos;
- CTA secundário para personalizados/orçamento;
- composição visual com fotos reais quando cadastradas; até lá, placeholders explícitos.

### 6.3 Categorias visuais

Categorias com ícone/imagem, nome curto e navegação:

- Papelaria escolar
- Escritório
- Cadernos e agendas
- Canetas e marcadores
- Topos de bolo
- Lembrancinhas
- Caixas e embalagens
- Decoração de festas
- Personalizados
- Presentes criativos

### 6.4 Vitrines

- Ofertas especiais
- Destaques
- Mais vendidos
- Novidades
- Recomendados para você
- Personalizados
- Inspiração criativa

As seções só mostram descontos/rankings reais quando houver fonte de dados real. Em modo demonstração, devem conter selo “Demonstração”.

## 7. Produto e catálogo

### Card

- imagem;
- nome;
- categoria;
- preço real opcional;
- preço promocional real opcional;
- selo de personalizável;
- favorito;
- botão adicionar;
- quantidade rápida;
- feedback visual ao adicionar.

### Detalhe

- galeria;
- descrição;
- preço;
- estoque quando aplicável;
- personalizações;
- tema;
- nome/idade quando aplicável;
- quantidade;
- prazo informado pela loja;
- produtos relacionados;
- adicionar ao carrinho;
- pedir no WhatsApp.

### Busca/filtros

- texto;
- categoria;
- faixa de preço quando houver preços reais;
- personalizável;
- disponibilidade;
- ordenação por relevância, preço, novidades e nome.

## 8. Carrinho e favoritos

### Carrinho

- persistência local para visitante;
- sincronização no backend para usuário autenticado;
- quantidade;
- remoção;
- subtotal automático;
- dados de personalização por item;
- drawer lateral no desktop/tablet e full-height no mobile;
- recuperação segura do carrinho após recarregar.

### Favoritos

- visitante: `localStorage`;
- autenticado: persistência no banco;
- sincronização do local para a conta após login, sem duplicatas.

## 9. Checkout/WhatsApp

Checkout é uma **conferência de pedido/orçamento**, não pagamento.

### Formulário

- nome completo;
- telefone com DDD;
- produto/serviço;
- quantidade;
- personalização;
- tema;
- nome e idade;
- data desejada;
- tipo de recebimento;
- endereço se entrega;
- observações;
- itens do carrinho.

### Fluxo

1. Validar campos.
2. Exibir tela de conferência.
3. Gerar mensagem organizada.
4. Aplicar `encodeURIComponent` uma única vez no payload final.
5. Abrir `https://wa.me/<numero>?text=<mensagem>`.
6. Registrar a solicitação no backend quando o backend estiver configurado.

### Regras de encoding

- número normalizado para dígitos;
- adicionar `55` quando o número brasileiro vier sem DDI;
- não usar dupla codificação;
- testes de ida/volta com acentos, emojis e quebras de linha;
- nunca permitir caractere de substituição `�`.

## 10. Agendamento

O atendimento será de um único profissional.

### Experiência

- calendário visual;
- horários disponíveis configuráveis;
- tipo de atendimento/serviço;
- nome;
- telefone;
- observações;
- tela de conferência;
- WhatsApp.

### Status

Sem integração com agenda transacional, todo agendamento será apresentado como:

**“Solicitação enviada — aguardando confirmação.”**

Nunca como horário confirmado automaticamente.

## 11. Conta e Meus pedidos

Autenticação por email/senha ou magic link.

### Cliente

- perfil;
- favoritos;
- carrinho sincronizado;
- solicitações/pedidos;
- status do pedido;
- detalhes do pedido;
- sem exposição de dados de outros clientes.

### Status sugeridos

- Solicitação recebida
- Aguardando confirmação
- Confirmado
- Em produção
- Pronto
- Entregue
- Cancelado

O WhatsApp continua sendo o canal humano principal.

## 12. Painel administrativo

Painel protegido em `/admin`.

### Capacidades

- CRUD de produtos;
- upload/organização de imagens;
- categorias;
- preços;
- promoções;
- estoque opcional;
- produtos personalizáveis;
- pedidos/solicitações;
- status;
- agenda/horários;
- conteúdo da Home;
- configurações comerciais básicas.

### Segurança

- acesso somente a usuários com papel `admin`;
- RLS no banco;
- validação server-side;
- nenhuma chave administrativa no navegador;
- logs de erro sem dados sensíveis.

## 13. Tecnologia — opções avaliadas

### Opção A — Recomendada

**React + TypeScript + Vite + Tailwind CSS + Framer Motion + Lucide + Supabase + Cloudflare Pages**

Vantagens:

- excelente compatibilidade com Cloudflare Pages;
- frontend rápido e simples de publicar;
- Supabase fornece Postgres, Auth, Storage e RLS;
- painel/admin e contas sem construir autenticação do zero;
- fácil conectar GitHub ao Cloudflare;
- custo inicial baixo para pequeno negócio.

Desvantagem: backend fica no Supabase, não 100% dentro do Cloudflare.

### Opção B — Cloudflare nativa

**React/Vite + Cloudflare Workers + D1 + R2 + autenticação customizada/terceirizada**

Vantagem: infraestrutura concentrada no Cloudflare.

Desvantagem: maior complexidade e superfície de segurança, especialmente para autenticação/admin.

### Opção C — Next.js full-stack + Cloudflare Workers + banco externo

Boa para SSR e futura expansão, mas aumenta complexidade de deploy sem necessidade clara nesta fase.

### Decisão recomendada

Adotar **Opção A**. O site continua hospedado no Cloudflare; Supabase é utilizado como backend seguro para os recursos que realmente exigem persistência.

## 14. Estrutura de código proposta

```text
amor-em-papel/
├── src/
│   ├── app/
│   ├── components/
│   │   ├── layout/
│   │   ├── catalog/
│   │   ├── cart/
│   │   ├── account/
│   │   ├── admin/
│   │   └── ui/
│   ├── features/
│   │   ├── catalog/
│   │   ├── cart/
│   │   ├── favorites/
│   │   ├── checkout/
│   │   ├── scheduling/
│   │   ├── auth/
│   │   └── orders/
│   ├── lib/
│   │   ├── supabase/
│   │   ├── whatsapp/
│   │   ├── validation/
│   │   └── seo/
│   ├── data/
│   └── styles/
├── public/
│   ├── brand/
│   └── placeholders/
├── supabase/
│   ├── migrations/
│   └── seed.sql
├── tests/
│   ├── unit/
│   ├── components/
│   └── e2e/
├── .github/workflows/
├── wrangler/config docs as applicable
└── README.md
```

## 15. Modelo de dados inicial

### `profiles`
- `id` UUID, FK auth user
- `name`
- `phone`
- `role` (`customer|admin`)
- timestamps

### `categories`
- `id`
- `slug`
- `name`
- `description`
- `image_url`
- `active`
- `sort_order`

### `products`
- `id`
- `slug`
- `name`
- `short_description`
- `description`
- `price_cents` nullable
- `compare_at_price_cents` nullable
- `track_inventory`
- `stock_quantity` nullable
- `is_customizable`
- `is_featured`
- `is_new`
- `is_demo`
- `active`
- timestamps

### `product_categories`
- product/category junction

### `product_images`
- `product_id`
- `storage_path`
- `alt`
- `sort_order`

### `favorites`
- `user_id`
- `product_id`
- unique pair

### `orders`
- `id`
- `user_id` nullable
- `customer_name`
- `customer_phone`
- `status`
- `subtotal_cents` nullable
- `delivery_type`
- `address_json` nullable
- `notes`
- timestamps

### `order_items`
- order/product snapshot
- `name_snapshot`
- `price_cents_snapshot` nullable
- `quantity`
- `customization_json`

### `appointment_requests`
- `user_id` nullable
- `service_type`
- `requested_date`
- `requested_time`
- `status = pending`
- `name`
- `phone`
- `notes`

### `availability_slots`
- dia/data
- horário
- ativo

## 16. Animações

- Framer Motion para drawer, modal, transições pequenas e reveal.
- CSS para hover/focus e microinterações simples.
- Skeletons com animação discreta.
- `prefers-reduced-motion: reduce` desliga movimentos não essenciais.
- Evitar animações simultâneas em excesso no mobile.

## 17. SEO e compartilhamento

- titles e descriptions por rota;
- Open Graph;
- imagem social 1200×630;
- canonical;
- sitemap;
- robots;
- JSON-LD para Organization/Product apenas quando dados reais estiverem presentes;
- modo preview `noindex` enquanto domínio/contato/conteúdo real estiver incompleto.

## 18. Cloudflare + GitHub

### GitHub

- repositório novo;
- CI obrigatório: lint, typecheck, unit, component, E2E smoke e build;
- branch principal protegida quando possível;
- sem secrets commitados.

### Cloudflare Pages

- deploy automático pelo GitHub;
- build command: `npm run build`;
- output: `dist`;
- variáveis públicas somente para URLs/IDs não secretos;
- secrets sensíveis no Supabase/Cloudflare settings, nunca no repo;
- preview deployments em PRs/branches.

## 19. Testes obrigatórios

### Unitários

- cálculo do carrinho;
- persistência/reidratação;
- busca/filtros/ordenação;
- normalização de WhatsApp;
- encoding/decoding com acentos, emoji e quebras;
- validação de checkout;
- disponibilidade/agendamento;
- regras de preço/estoque.

### Componentes

- ProductCard;
- ProductGrid;
- CartDrawer;
- Favorites;
- Search;
- CheckoutForm;
- AppointmentForm;
- Admin guards.

### E2E

- adicionar/remover/alterar quantidade;
- recarregar e manter carrinho;
- favoritar/desfavoritar;
- pesquisar e filtrar;
- abrir detalhe;
- checkout -> revisão -> WhatsApp;
- mensagem sem `�` e sem dupla codificação;
- mobile menu/drawer;
- login/logout;
- cliente não acessa `/admin`;
- admin acessa CRUD;
- agendamento sempre pendente até confirmação;
- 404;
- responsividade sem overflow em 360/390/430/768/1024/1280/1536.

## 20. Migração da V1.1.0

A V1.1.0 atual será preservada como referência funcional. A V2 poderá reutilizar:

- logo e assets da marca;
- regras de normalização do WhatsApp;
- regras de release readiness;
- copy institucional válida;
- SEO/social image;
- placeholders marcados como demonstração;
- testes conceituais de encoding e responsividade.

O frontend estático atual será substituído por componentes React/TypeScript, não mantido em paralelo como segunda interface.

## 21. Critério de “pronto para cliente”

A versão pode ser considerada pronta para publicação definitiva somente quando:

- WhatsApp real estiver configurado;
- domínio real estiver configurado;
- Instagram real estiver configurado ou ocultado;
- produtos reais/fotos reais estiverem cadastrados;
- textos demonstrativos estiverem removidos ou claramente mantidos como demonstração;
- admin real estiver criado;
- Supabase RLS estiver ativo e testado;
- checkout/WhatsApp passar E2E;
- build do GitHub estiver verde;
- deploy Cloudflare estiver verde;
- `check:release` estiver verde;
- QA mobile/desktop estiver aprovado.

## 22. Fora de escopo desta V2

- pagamento online;
- cálculo automático de frete por transportadora;
- emissão fiscal;
- integração automática com agenda externa;
- marketplace/múltiplos vendedores;
- múltiplos atendentes.

Esses recursos podem ser adicionados depois sem alterar a arquitetura principal.
