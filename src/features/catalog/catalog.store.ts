import { useMemo, useState } from 'react';
import type { Product } from './types';
import { filterProducts, sortProducts, type CatalogFilter, type CatalogSort } from './catalog.service';

export function useCatalog(products: Product[], initialFilter: CatalogFilter = {}) {
  const [filter, setFilter] = useState<CatalogFilter>(initialFilter);
  const [sort, setSort] = useState<CatalogSort>('newest');
  const visibleProducts = useMemo(() => sortProducts(filterProducts(products, filter), sort), [products, filter, sort]);
  return { filter, setFilter, sort, setSort, visibleProducts };
}
