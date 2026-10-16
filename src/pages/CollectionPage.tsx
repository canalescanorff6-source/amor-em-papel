import { demoProducts } from '../data/demoCatalog';
import { getProductsByCollection } from '../features/catalog/catalog.service';
import { ProductGrid } from '../features/catalog/ProductGrid';
import type { Product } from '../features/catalog/types';
export function CollectionPage({ collection, title, description }: { collection: Product['collections'][number]; title: string; description: string }) { const products = getProductsByCollection(demoProducts, collection); return <div><header className="page-header"><span className="eyebrow">Demonstração</span><h1>{title}</h1><p>{description}</p></header><ProductGrid products={products} /></div>; }
