import type { Product } from './types.ts';

export interface CatalogFilter {
  query?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  personalizable?: boolean;
}

export type CatalogSort = 'newest' | 'name' | 'price-low' | 'price-high';

function normalize(value: string): string {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('pt-BR').trim();
}

export function filterProducts(products: Product[], filter: CatalogFilter): Product[] {
  const query = normalize(filter.query ?? '');
  return products.filter((product) => {
    if (!product.isActive) return false;
    if (filter.category && product.categorySlug !== filter.category) return false;
    if (typeof filter.personalizable === 'boolean' && product.personalizable !== filter.personalizable) return false;
    if (typeof filter.minPrice === 'number' && (product.price === null || product.price < filter.minPrice)) return false;
    if (typeof filter.maxPrice === 'number' && (product.price === null || product.price > filter.maxPrice)) return false;
    if (query) {
      const haystack = normalize([product.name, product.shortDescription, product.description, ...product.tags].join(' '));
      if (!haystack.includes(query)) return false;
    }
    return true;
  });
}

export function sortProducts(products: Product[], sort: CatalogSort): Product[] {
  return [...products].sort((a, b) => {
    if (sort === 'name') return a.name.localeCompare(b.name, 'pt-BR');
    if (sort === 'price-low') return (a.price ?? Number.POSITIVE_INFINITY) - (b.price ?? Number.POSITIVE_INFINITY) || a.name.localeCompare(b.name, 'pt-BR');
    if (sort === 'price-high') return (b.price ?? Number.NEGATIVE_INFINITY) - (a.price ?? Number.NEGATIVE_INFINITY) || a.name.localeCompare(b.name, 'pt-BR');
    return b.createdAt.localeCompare(a.createdAt) || a.name.localeCompare(b.name, 'pt-BR');
  });
}

export function getProductBySlug(products: Product[], slug: string): Product | undefined {
  return products.find((product) => product.slug === slug && product.isActive);
}

export function getProductsByCollection(products: Product[], collection: Product['collections'][number]): Product[] {
  return products.filter((product) => product.isActive && product.collections.includes(collection));
}
