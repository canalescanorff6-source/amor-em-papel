import { describe, expect, it } from 'vitest';
import { buildOrderMessage } from '../../src/lib/whatsapp/buildMessage';
import type { CheckoutFormData } from '../../src/features/checkout/checkout.schema';
import type { CartItem } from '../../src/features/cart/cart.types';
import { demoProducts } from '../../src/data/demoCatalog';

describe('pedido WhatsApp inclui todos os campos do formulário', () => {
  it('informa quantidade e personalização digitadas e preserva UTF-8', () => {
    const form: CheckoutFormData = {
      fullName: 'Maria da Silva',
      phone: '98999998888',
      service: 'Topo de bolo',
      quantity: 3,
      customization: 'Três camadas, laço e coração 💗',
      theme: 'Céu azul',
      personalizedName: 'Lívia',
      age: '5',
      deliveryDate: '2026-12-20',
      receiptType: 'retirada',
      notes: 'Caprichar no lilás',
    };
    const items: CartItem[] = [
      { id: 'test', product: demoProducts[0], quantity: 2, customization: { summary: 'Camadas em rosa' } },
    ];
    const message = buildOrderMessage(form, items);
    expect(message).toContain('Quantidade solicitada: 3');
    expect(message).toContain('Personalização solicitada: Três camadas, laço e coração 💗');
    expect(message).toContain('2x ' + demoProducts[0].name);
    expect(message).toContain('Nome para personalização: Lívia');
    expect(message).not.toContain('�');
  });
});
