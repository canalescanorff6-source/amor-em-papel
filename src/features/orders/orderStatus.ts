export const orderStatuses = [
  'request_received',
  'awaiting_confirmation',
  'confirmed',
  'in_production',
  'ready',
  'delivered',
  'cancelled',
] as const;

export type OrderStatus = typeof orderStatuses[number];

const statusLabels: Record<OrderStatus, string> = {
  request_received: 'Solicitação registrada no site',
  awaiting_confirmation: 'Aguardando confirmação da loja',
  confirmed: 'Confirmado pela loja',
  in_production: 'Em produção',
  ready: 'Pronto para retirada ou entrega',
  delivered: 'Entregue',
  cancelled: 'Cancelado',
};

export function orderStatusLabel(status: string): string {
  return Object.prototype.hasOwnProperty.call(statusLabels, status)
    ? statusLabels[status as OrderStatus]
    : 'Status a confirmar';
}
