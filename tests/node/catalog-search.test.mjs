import test from 'node:test';
import assert from 'node:assert/strict';
import { demoProducts } from '../../src/data/demoCatalog.ts';
import { filterProducts, sortProducts } from '../../src/features/catalog/catalog.service.ts';

test('filters by text across name tags and description', () => {
  const result = filterProducts(demoProducts, { query: 'jardim' });
  assert.deepEqual(result.map((p) => p.slug), ['topo-de-bolo-jardim']);
});

test('filters by category and personalizable flag', () => {
  const result = filterProducts(demoProducts, { category: 'topos-de-bolo', personalizable: true });
  assert.equal(result.length, 1);
  assert.equal(result[0].personalizable, true);
});

test('price filter does not invent matches for products without real price', () => {
  const result = filterProducts(demoProducts, { minPrice: 1, maxPrice: 100 });
  assert.equal(result.length, 0);
});

test('stable name and newest sorting', () => {
  const byName = sortProducts(demoProducts, 'name');
  assert.equal(byName[0].name.localeCompare(byName.at(-1).name, 'pt-BR') <= 0, true);
  const newest = sortProducts(demoProducts, 'newest');
  assert.ok(newest[0].createdAt >= newest.at(-1).createdAt);
});
