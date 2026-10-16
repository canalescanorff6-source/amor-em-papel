export interface SeoInput { title: string; description: string; path?: string; siteUrl: string; imagePath?: string; }
export interface SeoMeta { title:string; description:string; robots:string; canonical:string; ogUrl:string; ogImage:string; }
export function buildSeoMeta({title,description,path='/',siteUrl,imagePath='/og-amor-em-papel.jpg'}:SeoInput):SeoMeta{
  const base=siteUrl.replace(/\/$/,'');
  const normalizedPath=path.startsWith('/')?path:`/${path}`;
  const canonical=base?`${base}${normalizedPath==='/'?'':normalizedPath}`:'';
  return {title:`${title} | Amor em Papel`,description,robots:base?'index, follow':'noindex, nofollow',canonical,ogUrl:canonical,ogImage:base?`${base}${imagePath}`:imagePath};
}
