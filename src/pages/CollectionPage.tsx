import { getProductsByCollection } from '../features/catalog/catalog.service';
import { ProductGrid } from '../features/catalog/ProductGrid';
import { useCatalogData } from '../features/catalog/CatalogDataProvider';
import type { Product } from '../features/catalog/types';

export function CollectionPage({ collection, title, description }: { collection: Product['collections'][number]; title: string; description: string }) {
  const { products, source } = useCatalogData();
  const visible = getProductsByCollection(products, collection);
  return (
    <div>
      <header className="page-header">
        <span className="eyebrow">{source === 'demo' ? 'Demonstração' : 'Amor em Papel'}</span>
        <h1>{title}</h1>
        <p>{description}</p>
      </header>
      <ProductGrid products={visible} />
    </div>
  );
}
