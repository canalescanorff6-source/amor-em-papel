-- Amor em Papel: gravação transacional de pedido + itens e proteção anti-duplicação.
-- A migração é aditiva: não altera pedidos históricos nem confirma pagamentos.
alter table public.orders add column if not exists client_request_id uuid;

create unique index if not exists orders_user_request_unique
  on public.orders (user_id, client_request_id)
  where client_request_id is not null;

create or replace function public.submit_order_request(
  p_request_id uuid,
  p_order jsonb,
  p_items jsonb
) returns uuid
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_user_id uuid := auth.uid();
  v_id uuid;
  v_item jsonb;
begin
  if v_user_id is null then
    raise exception 'Faça login para salvar o pedido no histórico.' using errcode='42501';
  end if;

  if p_request_id is null
    or p_order is null or jsonb_typeof(p_order) <> 'object'
    or p_items is null or jsonb_typeof(p_items) <> 'array'
    or jsonb_array_length(p_items) not between 1 and 50
  then
    raise exception 'Solicitação de pedido inválida.' using errcode='22023';
  end if;

  if nullif(btrim(p_order->>'customer_name'), '') is null
    or nullif(btrim(p_order->>'customer_phone'), '') is null
    or nullif(btrim(p_order->>'service'), '') is null
    or (p_order->>'receipt_type') not in ('retirada', 'entrega')
  then
    raise exception 'Campos obrigatórios do pedido ausentes.' using errcode='22023';
  end if;

  -- A identidade vem do JWT, nunca de um user_id/role recebido do navegador.
  -- No caso de repetição, devolvemos o mesmo pedido, sem gravar linhas novamente.
  insert into public.orders (
    user_id, client_request_id, customer_name, customer_phone, service,
    requested_quantity, requested_customization, theme, personalized_name,
    age, desired_date, receipt_type, address, notes, subtotal_cents, status
  ) values (
    v_user_id, p_request_id, btrim(p_order->>'customer_name'),
    btrim(p_order->>'customer_phone'), btrim(p_order->>'service'),
    nullif(p_order->>'requested_quantity', '')::integer,
    nullif(p_order->>'requested_customization', ''),
    nullif(p_order->>'theme', ''), nullif(p_order->>'personalized_name', ''),
    nullif(p_order->>'age', ''), nullif(p_order->>'desired_date', '')::date,
    p_order->>'receipt_type', nullif(p_order->>'address', ''),
    nullif(p_order->>'notes', ''), nullif(p_order->>'subtotal_cents', '')::integer,
    'request_received'
  )
  on conflict (user_id, client_request_id) where client_request_id is not null
  do nothing
  returning id into v_id;

  if v_id is null then
    select o.id into v_id from public.orders o
    where o.user_id = v_user_id and o.client_request_id = p_request_id;
    if v_id is null then
      raise exception 'Não foi possível recuperar o pedido.' using errcode='23505';
    end if;
    return v_id;
  end if;

  for v_item in select value from jsonb_array_elements(p_items)
  loop
    if jsonb_typeof(v_item) <> 'object'
      or nullif(btrim(v_item->>'product_name'), '') is null
      or (v_item->>'quantity') !~ '^[0-9]+$'
      or (v_item->>'quantity')::integer not between 1 and 999
    then
      raise exception 'Item inválido. O pedido não foi salvo.' using errcode='22023';
    end if;

    insert into public.order_items (
      order_id, product_id, product_name, quantity, unit_price_cents, customization
    ) values (
      v_id,
      nullif(v_item->>'product_id', '')::uuid,
      btrim(v_item->>'product_name'),
      (v_item->>'quantity')::integer,
      nullif(v_item->>'unit_price_cents', '')::integer,
      coalesce(v_item->'customization', '{}'::jsonb)
    );
  end loop;

  return v_id;
end;
$$;

-- A função respeita RLS (security invoker). Jamais expor execução anônima.
revoke all on function public.submit_order_request(uuid, jsonb, jsonb) from public;
revoke all on function public.submit_order_request(uuid, jsonb, jsonb) from anon;
grant execute on function public.submit_order_request(uuid, jsonb, jsonb) to authenticated;

comment on function public.submit_order_request(uuid, jsonb, jsonb) is
  'Cria pedido e itens atomicamente, por usuário autenticado e chave de repetição. Não confirma entrega ou pagamento.';
