import { describe, expect, it } from 'vitest';
import { buildOrderDraft } from '../../src/features/orders/orderDraft';
import type { CheckoutPayload } from '../../src/lib/whatsapp/buildMessage';

const data: CheckoutPayload = {
  fullName: 'Maria da Silva', phone: '98999998888',
  service: 'Topo de bolo', quantity: 3,
  customization: '  Três camadas em lilás e rosa  ',
  theme: 'Princesa', personalizedName: 'Lívia', age: '5',
  deliveryDate: '2026-12-20', receiptType: 'entrega',
  address: 'Rua das Flores, 35', notes: 'Entrega após as 14h',
};

describe('registro do pedido', () => {
  it('preserva a quantidade e a personalização exatas do formulário', () => {
    const draft = buildOrderDraft('usuario-123', data, 159.9);
    expect(draft).toMatchObject({
      user_id: 'usuario-123',
      requested_quantity: 3,
      requested_customization: 'Três camadas em lilás e rosa',
      customer_name: 'Maria da Silva',
      personalized_name: 'Lívia',
      subtotal_cents: 15990,
      status: 'request_received',
    });
  });

  it('não inventa preço, quantidade ou personalização omitidos', () => {
    const { quantity, customization, ...withoutCustomization } = data;
    const draft = buildOrderDraft('usuario-123', withoutCustomization, null);
    expect(draft.requested_quantity).toBeNull();
    expect(draft.requested_customization).toBeNull();
    expect(draft.subtotal_cents).toBeNull();
  });
});
