import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase/client';

export function AdminDashboard() {
  const [stats, setStats] = useState<{products:number;orders:number;appointments:number}|null>(null);
  useEffect(()=>{ if(!supabase)return; Promise.all([
    supabase.from('products').select('*',{count:'exact',head:true}),
    supabase.from('orders').select('*',{count:'exact',head:true}),
    supabase.from('appointments').select('*',{count:'exact',head:true})
  ]).then(([p,o,a])=>setStats({products:p.count??0,orders:o.count??0,appointments:a.count??0})); },[]);
  return <div><header className="page-header"><span className="eyebrow">Painel administrativo</span><h1>Visão geral</h1><p>Gerencie catálogo, pedidos e disponibilidade sem editar o código do site.</p></header>{!supabase&&<div className="backend-notice">Conecte o Supabase para habilitar dados administrativos reais.</div>}<div className="admin-stat-grid"><article><span>Produtos</span><strong>{stats?.products??'—'}</strong></article><article><span>Pedidos</span><strong>{stats?.orders??'—'}</strong></article><article><span>Agendamentos</span><strong>{stats?.appointments??'—'}</strong></article></div></div>;
}
