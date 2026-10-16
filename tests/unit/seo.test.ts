import { buildSeoMeta } from '../../src/lib/seo/seo.logic';
test('preview is noindex',()=>{expect(buildSeoMeta({title:'Home',description:'x',siteUrl:''}).robots).toBe('noindex, nofollow');});
