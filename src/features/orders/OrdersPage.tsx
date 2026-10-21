import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase/client';
import { useAuth } from '../auth/AuthProvider';
import { orderStatusLabel } from './orderStatus';

type Order = {
  id: string;
  status: string;
  created_at: string;
  customer_name: string;
  order_items: { product_name: string; quantity: number }[] | null;
};

export function OrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError('');
    setOrders([]);
    if (!supabase || !user) {
      setLoading(false);
      return;
    }

    void supabase.from('orders')
      .select('id,status,created_at,customer_name,order_items(product_name,quantity)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .then(({ data, error: fetchError }) => {
        if (!active) return;
        setOrders((data ?? []) as Order[]);
        setError(fetchError ? 'Não foi possível carregar os pedidos. Atualize a página para tentar novamente.' : '');
        setLoading(false);
      });
    return () => { active = false; };
  }, [user?.id]);

  return <section className="page-wrap">
    <div className="page-head">
      <span className="eyebrow">Acompanhamento</span>
      <h1>Meus pedidos</h1>
      <p>Acompanhe solicitações registradas nesta conta. A confirmação do orçamento e da data é feita pela loja.</p>
    </div>
    {!user && <div className="notice">Entre na sua conta para consultar pedidos salvos. <Link to="/conta">Acessar conta</Link></div>}
    {loading ? <div className="surface" role="status">Carregando seus pedidos...</div>
      : error ? <div className="notice" role="alert">{error}</div>
      : user && orders.length ? <div className="order-list">{orders.map(order =>
        <article className="surface" key={order.id}>
          <strong>Solicitação #{order.id.slice(0, 8).toUpperCase()}</strong>
          <span>{new Date(order.created_at).toLocaleDateString('pt-BR')}</span>
          <b>{orderStatusLabel(order.status)}</b>
          {!!order.order_items?.length && <p>
            {order.order_items.map(item => `${item.quantity}x ${item.product_name}`).join(' • ')}
          </p>}
        </article>)}</div>
      : user && <div className="notice">Nenhuma solicitação registrada nesta conta. Pedidos enviados apenas pelo WhatsApp não aparecem automaticamente aqui.</div>}
  </section>;
}
