import { useEffect, useState } from 'react';
import { AlertCircle, CheckCircle2, Database, ImageOff } from 'lucide-react';
import { supabase } from '../../lib/supabase/client';

type Health = {
  products: number;
  activeProducts: number;
  demoProducts: number;
  missingImages: number;
  orders: number;
  pendingOrders: number;
  appointments: number;
  pendingAppointments: number;
};

const initial: Health = { products: 0, activeProducts: 0, demoProducts: 0, missingImages: 0, orders: 0, pendingOrders: 0, appointments: 0, pendingAppointments: 0 };

export function AdminDashboard() {
  const [health, setHealth] = useState<Health>(initial);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!supabase) return;
    (async () => {
      const [productsResult, imagesResult, ordersResult, appointmentsResult] = await Promise.all([
        supabase.from('products').select('id,is_active,is_demo'),
        supabase.from('product_images').select('product_id'),
        supabase.from('orders').select('id,status'),
        supabase.from('appointments').select('id,status'),
      ]);
      const firstError = productsResult.error ?? imagesResult.error ?? ordersResult.error ?? appointmentsResult.error;
      if (firstError) { setError(firstError.message); return; }
      const products = productsResult.data ?? [];
      const imageProductIds = new Set((imagesResult.data ?? []).map((row) => row.product_id));
      const orders = ordersResult.data ?? [];
      const appointments = appointmentsResult.data ?? [];
      setHealth({
        products: products.length,
        activeProducts: products.filter((row) => row.is_active).length,
        demoProducts: products.filter((row) => row.is_demo).length,
        missingImages: products.filter((row) => !imageProductIds.has(row.id)).length,
        orders: orders.length,
        pendingOrders: orders.filter((row) => ['request_received', 'awaiting_confirmation'].includes(row.status)).length,
        appointments: appointments.length,
        pendingAppointments: appointments.filter((row) => row.status === 'pending').length,
      });
    })();
  }, []);

  const catalogHealthy = health.products > 0 && health.activeProducts > 0 && health.demoProducts === 0 && health.missingImages === 0;

  return <section className="page-wrap">
    <div className="page-head"><span className="eyebrow">Painel protegido</span><h1>Administração</h1><p>Produtos, pedidos, agenda e saúde de publicação em uma visão simples.</p></div>
    {error && <div className="notice">Não foi possível carregar os indicadores: {error}</div>}
    <div className="admin-stats admin-stats-wide">
      <article><span>Produtos</span><strong>{health.products}</strong><small>{health.activeProducts} publicados</small></article>
      <article><span>Pedidos</span><strong>{health.orders}</strong><small>{health.pendingOrders} aguardando ação</small></article>
      <article><span>Agendamentos</span><strong>{health.appointments}</strong><small>{health.pendingAppointments} pendentes</small></article>
      <article><span>Fotos pendentes</span><strong>{health.missingImages}</strong><small>{health.demoProducts} produtos demo</small></article>
    </div>
    <div className={`health-card ${catalogHealthy ? 'healthy' : 'attention'}`}>
      {catalogHealthy ? <CheckCircle2/> : <AlertCircle/>}
      <div><strong>{catalogHealthy ? 'Catálogo pronto para dados reais' : 'Catálogo precisa de atenção'}</strong><span>{catalogHealthy ? 'Produtos publicados sem conteúdo demonstrativo ou imagem ausente.' : 'Revise produtos demo, fotos ausentes e publicação antes de desativar o modo demonstrativo.'}</span></div>
    </div>
    <div className="admin-health-grid">
      <article><Database/><div><strong>Backend protegido</strong><span>RLS controla leitura e escrita; a service role não vai para o navegador.</span></div></article>
      <article><ImageOff/><div><strong>Mídia auditável</strong><span>O painel mostra quantos produtos ainda estão sem foto cadastrada.</span></div></article>
    </div>
  </section>;
}
