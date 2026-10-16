import { CircleUserRound, Heart, Menu, Search, ShoppingBag } from 'lucide-react';
import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCatalogData } from '../../features/catalog/CatalogDataProvider';

export function TopHeader({ cartCount = 0, favoritesCount = 0, onMenu, onCart }: { cartCount?: number; favoritesCount?: number; onMenu?: () => void; onCart?: () => void }) {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const { products } = useCatalogData();

  function submit(event: FormEvent) {
    event.preventDefault();
    const value = query.trim();
    navigate(value ? `/produtos?q=${encodeURIComponent(value)}` : '/produtos');
  }

  return (
    <header className="top-header">
      <button type="button" className="icon-button top-header__menu" aria-label="Abrir menu" onClick={onMenu}><Menu size={22} /></button>
      <Link to="/" className="top-header__brand"><img src="/logo-amor-em-papel.jpg" alt="Amor em Papel" /></Link>
      <form className="search-box" role="search" onSubmit={submit}>
        <Search size={19} aria-hidden="true" />
        <input value={query} onChange={(event) => setQuery(event.target.value)} aria-label="Buscar produtos" placeholder="O que você está procurando?" list="product-search-suggestions" />
        <datalist id="product-search-suggestions">{products.map((product)=><option key={product.id} value={product.name}/>)}</datalist>
        <button type="submit">Buscar</button>
      </form>
      <div className="top-header__actions">
        <Link className="icon-button count-button" to="/favoritos" aria-label="Abrir favoritos"><Heart size={21} /><span>{favoritesCount}</span></Link>
        <button type="button" className="icon-button count-button" aria-label="Abrir carrinho" onClick={onCart}><ShoppingBag size={21} /><span>{cartCount}</span></button>
        <Link className="account-button" to="/conta"><CircleUserRound size={22} /><span>Minha conta</span></Link>
      </div>
    </header>
  );
}
