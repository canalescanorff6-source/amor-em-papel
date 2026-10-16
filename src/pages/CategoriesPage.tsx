import { Link } from 'react-router-dom';
import { useCatalogData } from '../features/catalog/CatalogDataProvider';
import { Skeleton } from '../components/ui/Skeleton';

export function CategoriesPage() {
  const { categories, loading } = useCatalogData();
  return (
    <div>
      <header className="page-header"><span className="eyebrow">Categorias</span><h1>Escolha por tipo de produto</h1></header>
      {loading ? (
        <div className="category-grid">{Array.from({ length: 6 }, (_, index) => <Skeleton key={index} height={130} />)}</div>
      ) : (
        <div className="category-grid">{categories.map((category) => <Link key={category.id} to={`/categoria/${category.slug}`} className={`category-card category-card--${category.accent}`}><span>{category.name.slice(0,1)}</span><div><h2>{category.name}</h2><p>{category.description}</p></div></Link>)}</div>
      )}
    </div>
  );
}
