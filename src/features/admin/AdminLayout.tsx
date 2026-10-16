import type { PropsWithChildren } from 'react';
import { NavLink } from 'react-router-dom';
import { Boxes, CalendarDays, ClipboardList, LayoutDashboard } from 'lucide-react';

export function AdminLayout({ children }: PropsWithChildren) {
  return <div className="admin-layout"><aside className="admin-nav"><span className="eyebrow">Admin</span><h2>Amor em Papel</h2><NavLink to="/admin" end><LayoutDashboard size={17}/>Visão geral</NavLink><NavLink to="/admin/produtos"><Boxes size={17}/>Produtos</NavLink><NavLink to="/admin/pedidos"><ClipboardList size={17}/>Pedidos</NavLink><NavLink to="/admin/agenda"><CalendarDays size={17}/>Agenda</NavLink></aside><section className="admin-content">{children}</section></div>;
}
