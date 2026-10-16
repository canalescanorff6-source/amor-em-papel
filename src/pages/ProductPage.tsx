import { Navigate, useParams } from 'react-router-dom';
import { demoProducts } from '../data/demoCatalog';
import { getProductBySlug } from '../features/catalog/catalog.service';
import { ProductDetail } from '../features/catalog/ProductDetail';
export function ProductPage() { const { slug = '' } = useParams(); const product = getProductBySlug(demoProducts, slug); return product ? <ProductDetail product={product} /> : <Navigate to="/404" replace />; }
