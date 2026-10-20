import { supabase } from '../../lib/supabase/client';
import type { CartItem } from '../cart/cart.types';
import type { CheckoutPayload } from '../../lib/whatsapp/buildMessage';
import { buildOrderDraft } from './orderDraft';

export async function persistOrder(
  userId: string,
  data: CheckoutPayload,
  items: CartItem[],
  subtotal: number | null,
) {
  if (!supabase) return { id: null, error: 'Backend não configurado.' };
  const { data: order, error } = await supabase
    .from('orders')
    .insert(buildOrderDraft(userId, data, subtotal))
    .select('id')
    .single();

  if (error || !order) return { id: null, error: error?.message || 'Falha ao criar pedido.' };

  const rows = items.map(item => ({
    order_id: order.id,
    product_id: item.product.isDemo ? null : item.product.id,
    product_name: item.product.name,
    quantity: item.quantity,
    unit_price_cents: item.product.price === null ? null : Math.round(item.product.price * 100),
    customization: item.customization ?? {},
  }));
  const { error: itemError } = await supabase.from('order_items').insert(rows);
  return { id: order.id, error: itemError?.message ?? null };
}
