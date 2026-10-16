import type { CartItem } from '../../features/cart/cart.types.ts';
import type { CheckoutData } from '../../features/checkout/checkout.types.ts';

const receiveLabel = { pickup: 'Retirada a combinar', delivery: 'Entrega' } as const;

export function buildOrderMessage(data: CheckoutData, items: CartItem[], sourceUrl = ''): string {
  const lines: string[] = [
    'Olá! Quero solicitar um pedido/orçamento na Amor em Papel. 💗',
    '',
    'DADOS DO CLIENTE',
    `Nome: ${data.fullName}`,
    `Telefone: ${data.phone}`,
    '',
    'PEDIDO',
    `Produto/serviço: ${data.productService}`,
    `Quantidade informada: ${data.quantity}`,
    `Personalização: ${data.customizationType || 'Não informada'}`,
    `Tema: ${data.theme || 'Não informado'}`,
    `Nome no personalizado: ${data.personalizedName || 'Não informado'}`,
    `Idade: ${data.age || 'Não informada'}`,
    `Data desejada: ${data.desiredDate}`,
    `Recebimento: ${receiveLabel[data.receiveType]}`,
    ...(data.receiveType === 'delivery' ? [`Endereço: ${data.address}`] : []),
    `Observações: ${data.notes || 'Nenhuma'}`,
    '',
    'ITENS DO CARRINHO'
  ];

  items.forEach((item, index) => {
    lines.push(`${index + 1}. ${item.productName} — qtd. ${item.quantity}${item.unitPrice === null ? ' — valor sob consulta' : ` — ${item.unitPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} cada`}`);
    const custom = Object.entries(item.customization);
    if (custom.length) lines.push(`   Personalização: ${custom.map(([key, value]) => `${key}: ${value}`).join(' | ')}`);
    if (item.isDemo) lines.push('   Observação: item demonstrativo; confirmar produto/preço real.');
  });

  if (sourceUrl) lines.push('', `Página de origem: ${sourceUrl}`);
  lines.push('', 'Entendo que prazo, disponibilidade, valor final e agendamento dependem da confirmação da loja.');
  return lines.join('\n');
}
