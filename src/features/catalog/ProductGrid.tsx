import type { ReactNode } from 'react';
import type { Product } from './types';
import { ProductCard } from './ProductCard';
import { EmptyState } from '../../components/ui/EmptyState';
export function ProductGrid({ products, emptyAction }: { products: Product[]; emptyAction?: ReactNode }) { if (!products.length) return <EmptyState title="Nenhum item encontrado" description="Tente mudar a busca ou remover algum filtro." action={emptyAction} />; return <div className="product-grid">{products.map((product) => <ProductCard key={product.id} product={product} />)}</div>; }
