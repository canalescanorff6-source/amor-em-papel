// @vitest-environment jsdom
import { beforeEach, describe, expect, it } from 'vitest';
import { demoProducts } from '../../src/data/demoCatalog';
import { loadCart, saveCart, getCartStorageKey } from '../../src/features/cart/cart.storage';
import { loadFavorites, saveFavorites, getFavoritesStorageKey } from '../../src/features/favorites/favorites.storage';

const item = { id: 'product-a', product: demoProducts[0], quantity: 2 };

describe('isolamento local entre clientes', () => {
  beforeEach(() => localStorage.clear());

  it('separa carrinhos autenticados sem expor itens para outra conta ou visitante', () => {
    saveCart({version: 1, items: [item]}, 'customer-1');
    expect(loadCart('customer-1').items).toHaveLength(1);
    expect(loadCart('customer-2').items).toHaveLength(0);
    expect(loadCart().items).toHaveLength(0);
    expect(getCartStorageKey('customer-1')).not.toBe(getCartStorageKey('customer-2'));
  });

  it('mantém o carrinho anterior de visitantes sem migrá-lo silenciosamente para contas', () => {
    saveCart({version: 1, items: [item]});
    expect(loadCart().items).toHaveLength(1);
    expect(loadCart('customer-1').items).toHaveLength(0);
  });

  it('separa favoritos autenticados e mantém os favoritos visitantes', () => {
    saveFavorites(['demo-a'], 'customer-1');
    saveFavorites(['guest-fav']);
    expect(loadFavorites('customer-1')).toEqual(['demo-a']);
    expect(loadFavorites('customer-2')).toEqual([]);
    expect(loadFavorites()).toEqual(['guest-fav']);
    expect(getFavoritesStorageKey('customer-1')).not.toBe(getFavoritesStorageKey('customer-2'));
  });

  it('ignora favoritos corrompidos sem quebrar a página', () => {
    localStorage.setItem(getFavoritesStorageKey('customer-1'), '{bad');
    expect(loadFavorites('customer-1')).toEqual([]);
  });
});
