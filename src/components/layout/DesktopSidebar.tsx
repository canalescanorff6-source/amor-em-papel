import { BadgePercent, CakeSlice, Heart, Headphones, Home, Lightbulb, ListFilter, PackageSearch, ReceiptText, ShoppingBag, Sparkles } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const items = [
  ['Início', '/', Home],
  ['Categorias', '/categorias', ListFilter],
  ['Promoções', '/promocoes', BadgePercent],
  ['Mais vendidos', '/mais-vendidos', Sparkles],
  ['Novidades', '/novidades', PackageSearch],
  ['Personalizados', '/personalizados', CakeSlice],
  ['Inspirações', '/inspiracoes', Lightbulb],
  ['Meus pedidos', '/meus-pedidos', ReceiptText],
  ['Favoritos', '/favoritos', Heart],
  ['Atendimento', '/atendimento', Headphones],
  ['Carrinho', '/carrinho', ShoppingBag]
] as const;

export function DesktopSidebar() {
  return (
    <aside className="desktop-sidebar" aria-label="Navegação principal">
      <NavLink to="/" className="brand-lockup" aria-label="Amor em Papel - Início">
        <img src="/logo-amor-em-papel.jpg" alt="" />
        <div><strong>Amor em Papel</strong><span>Papelaria personalizada</span></div>
      </NavLink>
      <nav className="sidebar-nav">
        {items.map(([label, to, Icon]) => <NavLink key={to} to={to} className={({ isActive }) => `sidebar-link ${isActive ? 'is-active' : ''}`}><Icon size={19} /><span>{label}</span></NavLink>)}
      </nav>
      <div className="sidebar-note"><Sparkles size={18} /><div><strong>Feito com carinho</strong><span>Personalizados sob confirmação.</span></div></div>
    </aside>
  );
}
