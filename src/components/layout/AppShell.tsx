import { useEffect, useState, type PropsWithChildren } from 'react';
import { X } from 'lucide-react';
import { CartDrawer } from '../../features/cart/CartDrawer';
import { useCart } from '../../features/cart/cart.store';
import { useFavorites } from '../../features/favorites/favorites.store';
import { DesktopSidebar } from './DesktopSidebar';
import { MobileNav } from './MobileNav';
import { RightRail } from './RightRail';
import { TopHeader } from './TopHeader';
import { Seo } from '../../lib/seo/Seo';
export function AppShell({ children }: PropsWithChildren) { const [menuOpen,setMenuOpen]=useState(false); const [cartOpen,setCartOpen]=useState(false); const cart=useCart(); const favorites=useFavorites(); useEffect(()=>{ const close=(event:KeyboardEvent)=>event.key==='Escape'&&(setMenuOpen(false),setCartOpen(false)); window.addEventListener('keydown',close); return()=>window.removeEventListener('keydown',close); },[]); return <div className="app-shell"><Seo /><DesktopSidebar/><div className="app-shell__center"><TopHeader cartCount={cart.count} favoritesCount={favorites.count} onMenu={()=>setMenuOpen(true)} onCart={()=>setCartOpen(true)}/><div className="app-content">{children}</div></div><RightRail/><MobileNav/>{menuOpen&&<div className="mobile-menu-layer" role="presentation" onMouseDown={(event)=>event.currentTarget===event.target&&setMenuOpen(false)}><div className="mobile-menu" role="dialog" aria-modal="true" aria-label="Menu"><button type="button" className="icon-button mobile-menu__close" aria-label="Fechar menu" onClick={()=>setMenuOpen(false)}><X size={21}/></button><DesktopSidebar/></div></div>}<CartDrawer open={cartOpen} onClose={()=>setCartOpen(false)}/></div>; }
