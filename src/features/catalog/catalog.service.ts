import type { Product } from './types';
export type CatalogQuery = { text?: string; categoryId?: string; personalizable?: boolean; minPrice?: number; maxPrice?: number; sort?: 'relevance'|'name-asc'|'price-asc'|'price-desc'|'newest' };
const norm = (v:string) => v.normalize('NFD').replace(/[̀-ͯ]/g,'').toLowerCase().trim();
export function filterProducts(products: Product[], query: CatalogQuery): Product[] {
  const text=norm(query.text ?? '');
  let result=products.filter((p)=>p.isActive);
  if(text) result=result.filter((p)=>norm([p.name,p.description,...p.tags].join(' ')).includes(text));
  if(query.categoryId) result=result.filter((p)=>p.categoryId===query.categoryId);
  if(query.personalizable) result=result.filter((p)=>p.isPersonalizable);
  if(query.minPrice !== undefined) result=result.filter((p)=>p.price!==null && p.price>=query.minPrice!);
  if(query.maxPrice !== undefined) result=result.filter((p)=>p.price!==null && p.price<=query.maxPrice!);
  const indexed=result.map((p,i)=>({p,i}));
  indexed.sort((a,b)=>{
    const sort=query.sort ?? 'relevance';
    if(sort==='name-asc') return a.p.name.localeCompare(b.p.name,'pt-BR') || a.i-b.i;
    if(sort==='newest') return Number(b.p.isNew)-Number(a.p.isNew) || a.i-b.i;
    if(sort==='price-asc') return (a.p.price ?? Number.POSITIVE_INFINITY)-(b.p.price ?? Number.POSITIVE_INFINITY) || a.i-b.i;
    if(sort==='price-desc') return (b.p.price ?? Number.NEGATIVE_INFINITY)-(a.p.price ?? Number.NEGATIVE_INFINITY) || a.i-b.i;
    return a.i-b.i;
  });
  return indexed.map(({p})=>p);
}
export const formatPrice=(value:number|null)=> value===null ? 'Preço sob consulta' : new Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL'}).format(value);
