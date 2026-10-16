import test from 'node:test';
import assert from 'node:assert/strict';
import { demoProducts } from '../../src/data/demoCatalog.ts';
import { buildSiteConfig } from '../../src/lib/config/siteConfig.ts';
import { getReleaseReadiness } from '../../src/lib/config/releaseReadiness.ts';

test('all demonstration products are explicit and have no synthetic commercial claims', () => {
  assert.ok(demoProducts.length >= 8);
  for (const product of demoProducts) {
    assert.equal(product.isDemo, true);
    assert.equal(product.price, null);
    assert.equal(product.compareAtPrice, null);
    assert.equal('rating' in product, false);
    assert.equal('discountPercentage' in product, false);
  }
});

test('release readiness blocks placeholder commerce data', () => {
  const config = buildSiteConfig({});
  const result = getReleaseReadiness(config, demoProducts);
  assert.equal(result.ready, false);
  assert.ok(result.blockers.some((item) => item.includes('WhatsApp')));
  assert.ok(result.blockers.some((item) => item.includes('domínio')));
  assert.ok(result.blockers.some((item) => item.includes('produto real')));
});

test('Brazilian local WhatsApp is accepted by release readiness after config normalization', () => {
  const config = buildSiteConfig({
    VITE_SITE_URL: 'https://amorempapel.com.br',
    VITE_WHATSAPP_NUMBER: '98912345678',
    VITE_INSTAGRAM_URL: 'https://instagram.com/amorempapel',
    VITE_SERVICE_REGION: 'São Luís - MA'
  });
  const realProducts = [{ ...demoProducts[0], isDemo: false, price: 35 }];
  const result = getReleaseReadiness(config, realProducts);
  assert.equal(result.ready, true);
  assert.equal(config.whatsappNumber, '5598912345678');
});
