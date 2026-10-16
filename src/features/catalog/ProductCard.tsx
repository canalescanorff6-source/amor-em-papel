import { ChevronRight, Heart, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Product } from './types';
import { Badge } from '../../components/ui/Badge';
import { useCart } from '../cart/cart.store';
import { useFavorites } from '../favorites/favorites.store';

export function ProductCard({ product }: { product: Product }) {
  const cart = useCart();
  const favorites = useFavorites();
  const favorite = favorites.has(product.id);
  return (
    <article className="product-card">
      <div className="product-card__image-wrap">
        <img src={product.imageUrl} alt={product.imageAlt} className="product-card__image" />
        <button type="button" className={`product-card__heart ${favorite ? 'is-favorite' : ''}`} aria-label={`${favorite ? 'Remover' : 'Adicionar'} ${product.name} dos favoritos`} onClick={() => favorites.toggle(product.id)}><Heart size={18} fill={favorite ? 'currentColor' : 'none'} /></button>
        <div className="product-card__badges">{product.isDemo && <Badge>Demonstração</Badge>}{product.personalizable && <Badge tone="blue"><Sparkles size={12} /> Personalizável</Badge>}</div>
      </div>
      <div className="product-card__body">
        <span className="product-card__category">{product.categorySlug.replaceAll('-', ' ')}</span>
        <h3>{product.name}</h3><p>{product.shortDescription}</p>
        <div className="product-card__bottom"><strong>{product.price === null ? 'Sob consulta' : product.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</strong><Link to={`/produto/${product.slug}`} aria-label={`Ver detalhes de ${product.name}`}>Ver detalhes <ChevronRight size={15} /></Link></div>
        <button type="button" className="card-add-button" onClick={() => cart.add(product)}>Adicionar ao carrinho</button>
      </div>
    </article>
  );
}
