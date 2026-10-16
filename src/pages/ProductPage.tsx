import { Navigate, useParams } from 'react-router-dom';
import { getProductBySlug } from '../features/catalog/catalog.service';
import { useCatalogData } from '../features/catalog/CatalogDataProvider';
import { ProductDetail } from '../features/catalog/ProductDetail';
import { Skeleton } from '../components/ui/Skeleton';

export function ProductPage() {
  const { slug = '' } = useParams();
  const { products, loading } = useCatalogData();
  if (loading) return <Skeleton height={560} />;
  const product = getProductBySlug(products, slug);
  return product ? <ProductDetail product={product} /> : <Navigate to="/404" replace />;
}
