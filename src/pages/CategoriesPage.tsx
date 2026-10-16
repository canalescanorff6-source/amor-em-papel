import { Link } from 'react-router-dom';
import { categories } from '../data/demoCatalog';
export function CategoriesPage() { return <div><header className="page-header"><span className="eyebrow">Categorias</span><h1>Escolha por tipo de produto</h1></header><div className="category-grid">{categories.map((category) => <Link key={category.id} to={`/categoria/${category.slug}`} className={`category-card category-card--${category.accent}`}><span>{category.name.slice(0,1)}</span><div><h2>{category.name}</h2><p>{category.description}</p></div></Link>)}</div></div>; }
