import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { demoProducts } from '../../src/data/demoCatalog';
import { buildOrderRequest } from '../../src/features/orders/orders.service';
import type { CheckoutPayload } from '../../src/lib/whatsapp/buildMessage';

const request: CheckoutPayload = {
  fullName: 'Maria Silva', phone: '(98) 99999-1234', service: 'Topo personalizado',
  quantity: 2, customization: 'Lilás com glitter', theme: 'Jardim',
  personalizedName: 'Lívia', age: '5', deliveryDate: '2027-01-25',
  receiptType: 'retirada', notes: 'Sem pressa',
};

const sql = readFileSync('supabase/migrations/0004_atomic_order_requests.sql', 'utf8');

describe('pedido transacional e idempotente', () => {
  it('monta dados dos itens completos, preserva personalização e não inventa preço', () => {
    const item = { id: 'demo:rosa', product: demoProducts[0], quantity: 2,
      customization: { summary: 'Lilás com glitter' } };
    const payload = buildOrderRequest('usuario-teste', request, [item], null);
    expect(payload.p_order).not.toHaveProperty('user_id');
    expect(payload.p_order).not.toHaveProperty('status');
    expect(payload.p_order).toMatchObject({
      customer_name: 'Maria Silva', requested_quantity: 2,
      requested_customization: 'Lilás com glitter',
      subtotal_cents: null,
    });
    expect(payload.p_items).toEqual([{
      product_id: null, product_name: demoProducts[0].name,
      quantity: 2, unit_price_cents: null,
      customization: { summary: 'Lilás com glitter' },
    }]);
  });

  it('a mesma transação grava cabeçalho e itens, com chave única por conta', () => {
    expect(sql).toContain('create unique index if not exists orders_user_request_unique');
    expect(sql).toContain('on public.orders (user_id, client_request_id)');
    expect(sql).toContain('create or replace function public.submit_order_request');
    expect(sql).toContain('security invoker');
    expect(sql).toContain('auth.uid()');
    expect(sql).toContain('on conflict (user_id, client_request_id)');
    expect(sql).toContain('do nothing');
    expect(sql).toContain('returning id into v_id');
    expect(sql).toContain('insert into public.order_items');
    expect(sql).toContain('raise exception');
    expect(sql).toContain('grant execute on function public.submit_order_request(uuid, jsonb, jsonb) to authenticated');
    expect(sql).toContain('revoke all on function public.submit_order_request(uuid, jsonb, jsonb) from anon');
    expect(sql).not.toMatch(/security definer|service_role|autorizado automaticamente/i);
  });

  it('limita a quantidade de itens e mantém o status pendente no banco', () => {
    expect(sql).toContain('jsonb_array_length(p_items) not between 1 and 50');
    expect(sql).toContain("'request_received'");
    expect(sql).toContain('v_user_id, p_request_id');
    expect(sql).not.toContain('p_order->>\'user_id\'');
    expect(sql).not.toContain("p_order->>'status'");
  });
});
