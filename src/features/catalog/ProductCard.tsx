import { useEffect, useRef, useState } from 'react';
import { Check, Eye, Heart, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Product } from './types';
import { formatPrice } from './catalog.service';
import { useCart } from '../cart/cart.store';
import { useFavorites } from '../favorites/favorites.store';
import { Badge } from '../../components/ui/Badge';

export function ProductCard({ product }: { product: Product }) {
  const cart = useCart();
  const favorites = useFavorites();
  const [added, setAdded] = useState(false);
  const timer = useRef<number | null>(null);
  const isFavorite = favorites.has(product.id);

  useEffect(() => () => {
    if (timer.current !== null) window.clearTimeout(timer.current);
  }, []);

  const add = () => {
    cart.add(product);
    setAdded(true);
    if (timer.current !== null) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setAdded(false), 1600);
  };

  return <article className="product-card">
    <div className="product-media">
      <img src={product.image} alt={product.name} loading="lazy"/>
      {product.isDemo && <Badge tone="yellow">Demonstração</Badge>}
      <button className={`favorite-btn ${isFavorite ? 'active' : ''}`} onClick={() => favorites.toggle(product.id)} aria-label={isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'} aria-pressed={isFavorite}>
        <Heart size={18} fill={isFavorite ? 'currentColor' : 'none'}/>
      </button>
    </div>
    <div className="product-body">
      <div className="product-kicker">{product.isPersonalizable ? 'Personalizável' : 'Pronta entrega'}</div>
      <h3><Link to={`/produto/${product.slug}`}>{product.name}</Link></h3>
      <p>{product.description}</p>
      <div className="price-stack"><strong className="product-price">{formatPrice(product.price)}</strong>{product.compareAtPrice !== null && <del>{formatPrice(product.compareAtPrice)}</del>}</div>
      <div className="product-actions">
        <Link className="btn btn-ghost" to={`/produto/${product.slug}`}><Eye size={17}/> Ver</Link>
        <button className={`btn btn-primary ${added ? 'success' : ''}`} disabled={product.stock === 0} onClick={add} aria-label={added ? 'Adicionado ao carrinho' : product.stock === 0 ? 'Indisponível' : 'Adicionar'}>
          {added ? <Check size={17}/> : <Plus size={17}/>} {product.stock === 0 ? 'Indisponível' : added ? 'Adicionado!' : 'Adicionar'}
        </button>
      </div>
      <span className="sr-only" aria-live="polite">{added ? 'Produto adicionado ao carrinho' : ''}</span>
    </div>
  </article>;
}
