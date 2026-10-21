# Amor em Papel — pedidos completos, sem duplicação (V2.1)

## Defeito corrigido
A V2 gravava `orders` primeiro e `order_items` em outra requisição. Falhas na gravação dos itens poderiam deixar solicitações incompletas no histórico. Cliques repetidos ou nova tentativa após uma falha de conexão também podiam gerar cópias.

## Solução
- Migração incremental `supabase/migrations/0004_atomic_order_requests.sql`: adiciona a chave `client_request_id` e uma função Postgres `submit_order_request` com **security invoker** e RLS.
- A operação grava cabeçalho e itens dentro da **mesma transação**. Falhas invalidam tudo, em vez de persistir pedidos pela metade.
- A chave enviada é única por conta: repetir a mesma operação devolve o mesmo pedido sem duplicar itens.
- O usuário do pedido vem de `auth.uid()` no servidor, jamais do corpo enviado pelo navegador; a função só pode ser executada por `authenticated`.
- A interface mantém a mesma chave durante novas tentativas **na mesma conferência**, permitindo reenvio seguro após falhas temporárias.
- A integração WhatsApp permanece uma ação direta e independente: clique no link **não comprova entrega da mensagem**. Visitantes sem login podem solicitar orçamento pelo WhatsApp, mas não terão histórico persistido.
- Área *Meus pedidos* e painel administrativo exibem status em português e mostram itens. O status inicial é **Solicitação registrada no site**, sem afirmar que a loja confirmou.
- Não foram inventados WhatsApp real, preços, produtos, estoque, informações de clientes ou avaliações.

## Instalação no Supabase
Aplicar as migrações `0001`, `0002`, `0003`, `0004` na ordem indicada pelo repositório, em ambiente de homologação antes de produção. Conectar projeto via `.env.local`/variáveis do Cloudflare: nunca versionar a chave `service_role`.

**Importante:** o CI valida os contratos SQL e testa React/WhatsApp/TypeScript/navegação, mas **não executa a migração em um banco Supabase real** até existir um projeto conectado. Antes do lançamento, verificar com duas contas isoladas: pedido com dois produtos; repetição do mesmo request ID; erro no segundo item sem linha órfã; RLS impedindo leitura/escrita de outra conta; gerente confirmando status; mensagem WhatsApp preservando Unicode. Não declarar o backend publicado ou validado apenas pelo teste estático.

## Segurança e limites
O app continua sendo catálogo + orçamento, sem gateway de pagamento. Preços exibidos como estimativa continuam sujeitos à confirmação da profissional. O fluxo não reserva estoque, não confirma data, não cobra e não dispara mensagens automáticas via API WhatsApp.
