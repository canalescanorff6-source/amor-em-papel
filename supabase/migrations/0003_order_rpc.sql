create or replace function public.create_customer_order(order_input jsonb, items_input jsonb)
returns uuid
language plpgsql
security invoker
set search_path = public
as $$
declare
  new_order_id uuid;
  item jsonb;
begin
  if auth.uid() is null then raise exception 'Authentication required'; end if;
  insert into public.orders (user_id, status, customer_name, customer_phone, receive_type, delivery_address, desired_date, notes, subtotal, has_quote_items, whatsapp_message)
  values (
    auth.uid(), 'pending',
    coalesce(order_input->>'customer_name',''), coalesce(order_input->>'customer_phone',''),
    coalesce(order_input->>'receive_type','pickup'), coalesce(order_input->>'delivery_address',''),
    nullif(order_input->>'desired_date','')::date, coalesce(order_input->>'notes',''),
    coalesce((order_input->>'subtotal')::numeric,0), coalesce((order_input->>'has_quote_items')::boolean,false),
    coalesce(order_input->>'whatsapp_message','')
  ) returning id into new_order_id;
  for item in select * from jsonb_array_elements(items_input) loop
    insert into public.order_items (order_id, product_id, product_name, quantity, unit_price, customization, is_demo)
    values (
      new_order_id,
      case when coalesce(item->>'product_id','') ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$' then (item->>'product_id')::uuid else null end,
      coalesce(item->>'product_name',''), greatest(1, least(99, coalesce((item->>'quantity')::integer,1))),
      nullif(item->>'unit_price','')::numeric, coalesce(item->'customization','{}'::jsonb), coalesce((item->>'is_demo')::boolean,false)
    );
  end loop;
  return new_order_id;
end;
$$;

grant execute on function public.create_customer_order(jsonb, jsonb) to authenticated;
