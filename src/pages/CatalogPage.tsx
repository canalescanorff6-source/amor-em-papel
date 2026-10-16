import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filters } from '../features/catalog/Filters';
import { ProductGrid } from '../features/catalog/ProductGrid';
import { SearchBox } from '../features/catalog/SearchBox';
import { useCatalog } from '../features/catalog/catalog.store';
import { useCatalogData } from '../features/catalog/CatalogDataProvider';
import { Skeleton } from '../components/ui/Skeleton';

export function CatalogPage({ category, title = 'Todos os produtos', personalizable }: { category?: string; title?: string; personalizable?: boolean }) {
  const [params] = useSearchParams();
  const initialQuery = params.get('q') ?? '';
  const data = useCatalogData();
  const catalog = useCatalog(data.products, { query: initialQuery, category, personalizable });

  useEffect(() => {
    catalog.setFilter((current) => ({ ...current, query: initialQuery, category, personalizable }));
  }, [initialQuery, category, personalizable]);

  return (
    <div className="catalog-page">
      <header className="page-header">
        <span className="eyebrow">Catálogo</span>
        <h1>{title}</h1>
        <p>{data.source === 'demo' ? 'Conteúdo demonstrativo claramente identificado até o cadastro dos produtos reais.' : 'Produtos cadastrados pela Amor em Papel.'}</p>
      </header>
      {data.error && <div className="backend-notice">O catálogo real não pôde ser carregado agora; exibimos a demonstração para manter a navegação disponível.</div>}
      {data.loading ? (
        <div className="product-grid" aria-label="Carregando catálogo">
          {Array.from({ length: 8 }, (_, index) => <Skeleton key={index} height={320} />)}
        </div>
      ) : (
        <>
          <div className="catalog-toolbar">
            <SearchBox value={catalog.filter.query ?? ''} onChange={(query) => catalog.setFilter({ ...catalog.filter, query })} />
            <Filters categories={data.categories} filter={catalog.filter} sort={catalog.sort} onFilter={catalog.setFilter} onSort={catalog.setSort} />
          </div>
          <div className="catalog-count">{catalog.visibleProducts.length} produto(s)</div>
          <ProductGrid products={catalog.visibleProducts} />
        </>
      )}
    </div>
  );
}
