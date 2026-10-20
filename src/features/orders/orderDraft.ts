import type { CheckoutPayload } from '../../lib/whatsapp/buildMessage';

/**
 * Constrói os dados auditáveis do pedido. Preço e personalização continuam
 * sujeitos à confirmação da profissional antes de qualquer cobrança.
 */
export function buildOrderDraft(userId: string, data: CheckoutPayload, subtotal: number | null) {
  return {
    user_id: userId,
    customer_name: data.fullName,
    customer_phone: data.phone,
    service: data.service,
    requested_quantity: Number.isInteger(data.quantity) && (data.quantity ?? 0) > 0 ? data.quantity : null,
    requested_customization: data.customization?.trim() || null,
    theme: data.theme || null,
    personalized_name: data.personalizedName || null,
    age: data.age || null,
    desired_date: data.deliveryDate || null,
    receipt_type: data.receiptType,
    address: data.address || null,
    notes: data.notes || null,
    subtotal_cents: subtotal === null ? null : Math.round(subtotal * 100),
    status: 'request_received' as const,
  };
}
