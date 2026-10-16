import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

async function source(path) {
  return readFile(new URL(`../../${path}`, import.meta.url), 'utf8');
}

test('desktop sidebar exposes the full commerce navigation', async () => {
  const text = await source('src/components/layout/DesktopSidebar.tsx');
  for (const label of ['Início', 'Categorias', 'Promoções', 'Mais vendidos', 'Novidades', 'Personalizados', 'Inspirações', 'Meus pedidos', 'Favoritos', 'Atendimento', 'Carrinho']) {
    assert.ok(text.includes(label), `missing ${label}`);
  }
});

test('mobile navigation and header have accessible controls', async () => {
  const nav = await source('src/components/layout/MobileNav.tsx');
  const header = await source('src/components/layout/TopHeader.tsx');
  assert.match(nav, /aria-label="Navegação principal móvel"/);
  assert.match(header, /aria-label="Buscar produtos"/);
  assert.match(header, /aria-label="Abrir carrinho"/);
  assert.match(header, /aria-label="Abrir favoritos"/);
});
