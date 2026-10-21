import { describe, expect, it } from 'vitest';
import { orderStatuses, orderStatusLabel } from '../../src/features/orders/orderStatus';

describe('status de pedido em português', () => {
  it('mostra todos os status válidos em linguagem legível', () => {
    expect(orderStatuses).toHaveLength(7);
    for (const key of orderStatuses) {
      const label = orderStatusLabel(key);
      expect(label).not.toBe(key);
      expect(label).not.toContain('_');
      expect(label.length).toBeGreaterThan(5);
    }
  });

  it('nunca confirma automaticamente uma solicitação inicial', () => {
    expect(orderStatusLabel('request_received')).toBe('Solicitação registrada no site');
    expect(orderStatusLabel('awaiting_confirmation')).toBe('Aguardando confirmação da loja');
    expect(orderStatusLabel('desconhecido')).toBe('Status a confirmar');
  });
});
