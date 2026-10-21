import { supabase } from '../../lib/supabase/client';
import type { CartItem } from '../cart/cart.types';
import type { CheckoutPayload } from '../../lib/whatsapp/buildMessage';
import { buildOrderDraft } from './orderDraft';

export function buildOrderRequest(
  userId: string,
  data: CheckoutPayload,
  items: CartItem[],
  subtotal: number | null,
) {
  const draft = buildOrderDraft(userId, data, subtotal);
  // A função SQL usa auth.uid(); a identidade enviada pelo browser não é uma credencial.
  const { user_id: _userId, status: _status, ...order } = draft;
  void _userId;
  void _status;
  return {
    p_order: order,
    p_items: items.map(item => ({
      product_id: item.product.isDemo ? null : item.product.id,
      product_name: item.product.name,
      quantity: item.quantity,
      unit_price_cents: item.product.price === null ? null : Math.round(item.product.price * 100),
      customization: item.customization ?? {},
    })),
  };
}

/** Grava pedido e itens na MESMA transação com chave estável para repetição.
 * WhatsApp é um canal separado: sucesso no banco não comprova envio da mensagem.
 */
export async function persistOrder(
  userId: string,
  data: CheckoutPayload,
  items: CartItem[],
  subtotal: number | null,
  requestId: string,
): Promise<{ id: string | null; error: string | null }> {
  if (!supabase) return { id: null, error: 'Backend não configurado.' };
  if (!items.length) return { id: null, error: 'Adicione pelo menos um produto.' };
  const payload = buildOrderRequest(userId, data, items, subtotal);
  try {
    const { data: orderId, error } = await supabase.rpc('submit_order_request', {
      p_request_id: requestId,
      ...payload,
    });
    if (error) return { id: null, error: error.message };
    if (typeof orderId !== 'string' || !orderId) {
      return { id: null, error: 'O banco não retornou o identificador do pedido.' };
    }
    return { id: orderId, error: null };
  } catch {
    return { id: null, error: 'Não foi possível salvar o pedido neste momento.' };
  }
}
