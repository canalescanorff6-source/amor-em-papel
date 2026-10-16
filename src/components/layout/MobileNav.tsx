import { Heart, Home, Search, Shapes, ShoppingBag } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const mobileItems = [
  ['Início', '/', Home],
  ['Categorias', '/categorias', Shapes],
  ['Buscar', '/produtos', Search],
  ['Favoritos', '/favoritos', Heart],
  ['Carrinho', '/carrinho', ShoppingBag]
] as const;

export function MobileNav() {
  return <nav className="mobile-nav" aria-label="Navegação principal móvel">{mobileItems.map(([label, to, Icon]) => <NavLink key={label} to={to} className={({ isActive }) => isActive ? 'is-active' : ''}><Icon size={20} /><span>{label}</span></NavLink>)}</nav>;
}
