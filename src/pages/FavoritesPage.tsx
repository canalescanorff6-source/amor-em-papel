import { Link } from 'react-router-dom';
import { EmptyState } from '../components/ui/EmptyState';
import { demoProducts } from '../data/demoCatalog';
import { ProductGrid } from '../features/catalog/ProductGrid';
import { useFavorites } from '../features/favorites/favorites.store';
export function FavoritesPage() { const favorites = useFavorites(); const products = demoProducts.filter((product) => favorites.ids.includes(product.id)); return <div><header className="page-header"><span className="eyebrow">Favoritos</span><h1>Seus favoritos</h1></header>{products.length ? <ProductGrid products={products}/> : <EmptyState title="Nenhum favorito ainda" description="Salve modelos para comparar depois." action={<Link className="primary-link" to="/produtos">Explorar produtos</Link>} />}</div>; }
