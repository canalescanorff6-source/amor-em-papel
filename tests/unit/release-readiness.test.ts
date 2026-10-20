import { describe, expect, it } from 'vitest';
import { getReleaseReadiness } from '../../src/lib/config/releaseReadiness';
import { demoProducts } from '../../src/data/demoCatalog';
import type { SiteConfig } from '../../src/lib/config/siteConfig';

const base: SiteConfig = {
  brandName: 'Amor em Papel',
  baseUrl: '',
  whatsappNumber: '',
  instagramUrl: '',
  serviceRegion: '',
  supabaseUrl: '',
  supabaseAnonKey: '',
  demoFallback: true,
};

describe('release readiness', () => {
  it('blocks release while real client and backend data are missing', () => {
    const result = getReleaseReadiness(base, demoProducts);
    expect(result.ready).toBe(false);
    expect(result.blockers).toEqual(expect.arrayContaining([
      expect.stringMatching(/domínio HTTPS/i),
      expect.stringMatching(/WhatsApp real/i),
      expect.stringMatching(/Supabase/i),
      expect.stringMatching(/fallback demonstrativo/i),
    ]));
  });

  it('can become ready with real client data, backend and demo fallback disabled', () => {
    const products = demoProducts.map((product) => ({
      ...product,
      isDemo: false,
      image: '/real/produto.jpg',
      images: ['/real/produto.jpg'],
    }));
    const result = getReleaseReadiness({
      ...base,
      baseUrl: 'https://amorempapel.com.br',
      whatsappNumber: '5598999999999',
      supabaseUrl: 'https://project.supabase.co',
      supabaseAnonKey: 'anon-public-key',
      demoFallback: false,
    }, products);
    expect(result.ready).toBe(true);
    expect(result.blockers).toHaveLength(0);
  });
});

describe('validation of production settings', () => {
  it('blocks a malformed WhatsApp number instead of trusting a nonempty string', () => {
    const result = getReleaseReadiness({ ...base, whatsappNumber: 'telefone-pendente' }, []);
    expect(result.blockers).toEqual(expect.arrayContaining([
      expect.stringMatching(/WhatsApp/i),
    ]));
  });

  it('blocks malformed HTTPS origins', () => {
    const result = getReleaseReadiness({ ...base, baseUrl: 'https://' }, []);
    expect(result.blockers).toEqual(expect.arrayContaining([
      expect.stringMatching(/domínio HTTPS/i),
    ]));
  });
});
