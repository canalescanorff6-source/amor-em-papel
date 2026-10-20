-- Registra também os dados informados no formulário de orçamento.
-- Mantém compatibilidade com pedidos antigos (campos opcionais).
alter table public.orders
  add column if not exists requested_quantity integer
    check (requested_quantity > 0);
alter table public.orders
  add column if not exists requested_customization text;

comment on column public.orders.requested_quantity is
  'Quantidade solicitada no formulário, distinta das quantidades individuais no carrinho.';
comment on column public.orders.requested_customization is
  'Instrução de personalização informada pelo cliente, sujeita a confirmação manual.';
