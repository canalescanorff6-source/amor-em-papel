import test from 'node:test';
import assert from 'node:assert/strict';
import { buildSeoMeta } from '../../src/lib/seo/seo.logic.ts';
import { readFile } from 'node:fs/promises';

test('preview SEO is noindex and production SEO has canonical and OG URL', () => {
  const preview=buildSeoMeta({title:'Catálogo',description:'Teste',path:'/produtos',siteUrl:''});
  assert.equal(preview.robots,'noindex, nofollow');
  assert.equal(preview.canonical,'');
  const prod=buildSeoMeta({title:'Catálogo',description:'Teste',path:'/produtos',siteUrl:'https://amorempapel.com.br'});
  assert.equal(prod.robots,'index, follow');
  assert.equal(prod.canonical,'https://amorempapel.com.br/produtos');
  assert.equal(prod.ogUrl,prod.canonical);
});

test('Cloudflare headers include critical security controls and SPA redirect', async()=>{
  const headers=(await readFile(new URL('../../public/_headers',import.meta.url),'utf8')).toLowerCase();
  for(const value of ['content-security-policy','x-content-type-options','referrer-policy','permissions-policy']) assert.ok(headers.includes(value));
  const redirects=await readFile(new URL('../../public/_redirects',import.meta.url),'utf8');
  assert.match(redirects,/\/\*\s+\/index\.html\s+200/);
});
