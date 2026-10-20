import type { CartItem } from '../../features/cart/cart.types';

export type CheckoutPayload = {
  fullName: string;
  phone: string;
  service: string;
  quantity?: number;
  customization?: string;
  deliveryDate: string;
  receiptType: 'retirada' | 'entrega';
  address?: string;
  notes?: string;
  theme?: string;
  personalizedName?: string;
  age?: string;
};

export function buildOrderMessage(data: CheckoutPayload, items: CartItem[], pageUrl?: string): string {
  const lines = [
    `Olá! Meu nome é ${data.fullName}. Gostaria de solicitar um orçamento na Amor em Papel.`,
    '',
    'ITENS:',
  ];

  for (const item of items) {
    lines.push(`- ${item.quantity}x ${item.product.name}${item.customization?.summary ? ` — ${item.customization.summary}` : ''}`);
  }

  lines.push('', `Serviço: ${data.service}`);
  if (data.quantity !== undefined && Number.isInteger(data.quantity) && data.quantity > 0) {
    lines.push(`Quantidade solicitada: ${data.quantity}`);
  }
  if (data.customization?.trim()) {
    lines.push(`Personalização solicitada: ${data.customization.trim()}`);
  }
  lines.push(
    `Tema: ${data.theme || 'Não informado'}`,
    `Nome para personalização: ${data.personalizedName || 'Não informado'}`,
    `Idade: ${data.age || 'Não informado'}`,
    `Data desejada: ${data.deliveryDate}`,
    `Recebimento: ${data.receiptType === 'entrega' ? 'Entrega' : 'Retirada'}`,
  );
  if (data.receiptType === 'entrega') lines.push(`Endereço: ${data.address || 'Não informado'}`);
  lines.push(
    `Telefone: ${data.phone}`,
    `Observações: ${data.notes || 'Nenhuma'}`,
    '',
    'Este pedido é uma solicitação e aguarda confirmação da loja.',
  );
  if (pageUrl) lines.push(`Origem: ${pageUrl}`);
  return lines.join('\n');
}
