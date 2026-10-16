import { Link } from 'react-router-dom';
import { EmptyState } from '../components/ui/EmptyState';
import { ProductGrid } from '../features/catalog/ProductGrid';
import { useCatalogData } from '../features/catalog/CatalogDataProvider';
import { useFavorites } from '../features/favorites/favorites.store';

export function FavoritesPage() {
  const favorites = useFavorites();
  const { products } = useCatalogData();
  const favoriteProducts = products.filter((product) => favorites.ids.includes(product.id));
  return <div><header className="page-header"><span className="eyebrow">Favoritos</span><h1>Seus favoritos</h1></header>{favoriteProducts.length ? <ProductGrid products={favoriteProducts}/> : <EmptyState title="Nenhum favorito ainda" description="Salve modelos para comparar depois." action={<Link className="primary-link" to="/produtos">Explorar produtos</Link>} />}</div>;
}
