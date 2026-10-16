import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { categories, demoProducts } from '../data/demoCatalog';
import { Filters } from '../features/catalog/Filters';
import { ProductGrid } from '../features/catalog/ProductGrid';
import { SearchBox } from '../features/catalog/SearchBox';
import { useCatalog } from '../features/catalog/catalog.store';

export function CatalogPage({ category, title = 'Todos os produtos', personalizable }: { category?: string; title?: string; personalizable?: boolean }) {
  const [params] = useSearchParams();
  const initialQuery = params.get('q') ?? '';
  const catalog = useCatalog(demoProducts, { query: initialQuery, category, personalizable });
  useEffect(() => { catalog.setFilter((current) => ({ ...current, query: initialQuery, category, personalizable })); }, [initialQuery, category, personalizable]);
  return (
    <div className="catalog-page"><header className="page-header"><span className="eyebrow">Catálogo</span><h1>{title}</h1><p>Conteúdo demonstrativo claramente identificado até o cadastro dos produtos reais.</p></header><div className="catalog-toolbar"><SearchBox value={catalog.filter.query ?? ''} onChange={(query) => catalog.setFilter({ ...catalog.filter, query })} /><Filters categories={categories} filter={catalog.filter} sort={catalog.sort} onFilter={catalog.setFilter} onSort={catalog.setSort} /></div><div className="catalog-count">{catalog.visibleProducts.length} modelo(s)</div><ProductGrid products={catalog.visibleProducts} /></div>
  );
}
