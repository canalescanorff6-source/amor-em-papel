import test from 'node:test';
import assert from 'node:assert/strict';
import { mapDbCategory, mapDbProduct } from '../../src/features/catalog/catalog.data.ts';

test('database catalog mapper turns Supabase rows into public products without inventing commerce data', () => {
  const product = mapDbProduct({
    id: '11111111-1111-4111-8111-111111111111',
    slug: 'topo-jardim-real',
    name: 'Topo Jardim real',
    category_id: '22222222-2222-4222-8222-222222222222',
    short_description: 'Personalizado',
    description: 'Produto real',
    price: '39.90',
    compare_at_price: null,
    stock_status: 'available',
    personalizable: true,
    customization_fields: ['name', 'age', 'invalid'],
    tags: ['topo'],
    collections: ['featured', 'custom', 'invalid'],
    is_demo: false,
    is_active: true,
    created_at: '2026-10-16T12:00:00.000Z',
    categories: { slug: 'topos-de-bolo' },
    product_images: [
      { storage_path: 'x/secondary.jpg', alt_text: 'Secundária', sort_order: 1, is_primary: false },
      { storage_path: 'x/main.jpg', alt_text: 'Foto principal', sort_order: 5, is_primary: true }
    ]
  }, (path) => `https://cdn.example/${path}`);

  assert.equal(product.price, 39.9);
  assert.equal(product.compareAtPrice, null);
  assert.equal(product.isDemo, false);
  assert.equal(product.categorySlug, 'topos-de-bolo');
  assert.equal(product.imageUrl, 'https://cdn.example/x/main.jpg');
  assert.deepEqual(product.customizationFields, ['name', 'age']);
  assert.deepEqual(product.collections, ['featured', 'custom']);
});

test('database category mapper normalizes unsupported accent safely', () => {
  const category = mapDbCategory({ id: 'c1', slug: 'x', name: 'Categoria', accent: 'neon' });
  assert.equal(category.accent, 'pink');
});
