import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase/client';
import { orderStatuses, orderStatusLabel } from '../orders/orderStatus';

type Order = {
  id: string;
  customer_name: string;
  status: string;
  created_at: string;
  order_items: { product_name: string; quantity: number }[] | null;
};

export function OrdersAdminPage() {
  const [rows, setRows] = useState<Order[]>([]);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [notice, setNotice] = useState('');

  const refresh = async () => {
    if (!supabase) return;
    const { data, error } = await supabase.from('orders')
      .select('id,customer_name,status,created_at,order_items(product_name,quantity)')
      .order('created_at', { ascending: false });
    if (error) {
      setNotice('Não foi possível consultar os pedidos. Tente novamente.');
      return;
    }
    setRows((data ?? []) as Order[]);
  };

  useEffect(() => { void refresh(); }, []);

  const changeStatus = async (orderId: string, status: string) => {
    if (!supabase || savingId) return;
    setSavingId(orderId);
    setNotice('');
    try {
      const { error } = await supabase.from('orders').update({ status }).eq('id', orderId);
      if (error) setNotice('Não foi possível alterar o status. Verifique o acesso administrativo.');
      else {
        setNotice('Status atualizado com sucesso.');
        await refresh();
      }
    } catch {
      setNotice('Erro de conexão. O status não foi confirmado.');
    } finally {
      setSavingId(null);
    }
  };

  return <section>
    <h2>Solicitações de clientes</h2>
    <p>O registro no site não comprova que uma mensagem chegou ao WhatsApp. Confirme cada pedido diretamente com o cliente antes de iniciar a produção.</p>
    {notice && <div className="notice" role="status">{notice}</div>}
    <div className="admin-list">{rows.map(order => <article className="surface" key={order.id}>
      <div>
        <strong>{order.customer_name}</strong>
        <small>{new Date(order.created_at).toLocaleString('pt-BR')} · #{order.id.slice(0, 8).toUpperCase()}</small>
        <p>{order.order_items?.map(item => `${item.quantity}x ${item.product_name}`).join(' • ') || 'Itens não disponíveis'}</p>
      </div>
      <label>
        Status do pedido
        <select aria-label={`Status do pedido de ${order.customer_name}`}
          value={order.status} disabled={savingId !== null}
          onChange={event => void changeStatus(order.id, event.target.value)}>
          {orderStatuses.map(status => <option key={status} value={status}>{orderStatusLabel(status)}</option>)}
        </select>
      </label>
    </article>)}</div>
    {!rows.length && <p className="notice">Nenhuma solicitação cadastrada no momento.</p>}
  </section>;
}
