import { describe, expect, it } from 'vitest';
import { checkoutSchema } from '../../src/features/checkout/checkout.schema';
import { appointmentSchema } from '../../src/features/scheduling/scheduling.schema';
import { normalizeBrazilPhone } from '../../src/lib/whatsapp/normalizePhone';
import { isRequestedDateValid } from '../../src/lib/validation/requestedDate';

const localDate = (d: Date) => [d.getFullYear(), String(d.getMonth() + 1).padStart(2, '0'), String(d.getDate()).padStart(2, '0')].join('-');
const today = () => localDate(new Date());
const yesterday = () => { const d = new Date(); d.setDate(d.getDate() - 1); return localDate(d); };
const tomorrow = () => { const d = new Date(); d.setDate(d.getDate() + 1); return localDate(d); };
const order = (overrides: Record<string, unknown> = {}) => ({
  fullName: 'Maria da Silva', phone: '(98) 99999-8888',
  service: 'Topo de bolo', quantity: 1, deliveryDate: tomorrow(), receiptType: 'retirada', ...overrides,
});
const appointment = (overrides: Record<string, unknown> = {}) => ({
  name: 'Maria da Silva', phone: '(98) 99999-8888',
  service: 'Orçamento', date: tomorrow(), time: '09:00', ...overrides,
});

describe('datas solicitadas (fuso local, calendário real)', () => {
  it('aceita hoje e amanhã', () => {
    expect(isRequestedDateValid(today())).toBe(true);
    expect(isRequestedDateValid(tomorrow())).toBe(true);
    expect(checkoutSchema.safeParse(order({ deliveryDate: today() })).success).toBe(true);
    expect(appointmentSchema.safeParse(appointment({ date: tomorrow() })).success).toBe(true);
  });

  it('recusa dia anterior, data impossível e data com formato incorreto', () => {
    expect(isRequestedDateValid(yesterday())).toBe(false);
    expect(isRequestedDateValid('2026-02-30')).toBe(false);
    expect(isRequestedDateValid('2026/12/20')).toBe(false);
    expect(checkoutSchema.safeParse(order({ deliveryDate: yesterday() })).success).toBe(false);
    expect(appointmentSchema.safeParse(appointment({ date: yesterday() })).success).toBe(false);
  });
});

describe('DDD brasileiro no pedido e no agendamento', () => {
  it('aceita celular brasileiro com DDD, com e sem +55', () => {
    expect(normalizeBrazilPhone('(98) 99999-8888')).toBe('5598999998888');
    expect(checkoutSchema.safeParse(order({ phone: '+55 (98) 99999-8888' })).success).toBe(true);
    expect(appointmentSchema.safeParse(appointment({ phone: '98999998888' })).success).toBe(true);
  });

  it('recusa telefones fictícios, DDD inexistente e número sem DDD', () => {
    for (const phone of ['11111111111', '00000000000', '(00) 99999-8888', '99999-8888', 'xx99999999999']) {
      expect(normalizeBrazilPhone(phone), phone).toBe('');
      expect(checkoutSchema.safeParse(order({ phone })).success, phone).toBe(false);
      expect(appointmentSchema.safeParse(appointment({ phone })).success, phone).toBe(false);
    }
  });
});
