import test from 'node:test';
import assert from 'node:assert/strict';
import { addCartItem, removeCartItem, updateCartQuantity, cartSubtotal } from '../../src/features/cart/cart.store.logic.ts';
import { loadCart, saveCart } from '../../src/features/cart/cart.storage.ts';
import { demoProducts } from '../../src/data/demoCatalog.ts';

const real = { ...demoProducts[0], id: 'real-1', isDemo: false, price: 25 };

test('cart add merges only same product with same customization snapshot', () => {
  let items = addCartItem([], real, 1, { name: 'Lia', theme: 'Jardim' });
  items = addCartItem(items, real, 2, { name: 'Lia', theme: 'Jardim' });
  assert.equal(items.length, 1);
  assert.equal(items[0].quantity, 3);
  items = addCartItem(items, real, 1, { name: 'Ana', theme: 'Jardim' });
  assert.equal(items.length, 2);
});

test('quantity update and removal never produce invalid quantities', () => {
  let items = addCartItem([], real, 1, {});
  items = updateCartQuantity(items, items[0].key, 4);
  assert.equal(items[0].quantity, 4);
  items = updateCartQuantity(items, items[0].key, 0);
  assert.equal(items.length, 0);
  items = addCartItem([], real, 1, {});
  assert.equal(removeCartItem(items, items[0].key).length, 0);
});

test('subtotal sums only products with known real prices', () => {
  const priced = addCartItem([], real, 2, {});
  const mixed = addCartItem(priced, demoProducts[1], 5, {});
  assert.equal(cartSubtotal(mixed), 50);
});

test('versioned storage recovers from invalid JSON', () => {
  const memory = new Map();
  const storage = { getItem: (key) => memory.get(key) ?? null, setItem: (key, value) => memory.set(key, value), removeItem: (key) => memory.delete(key) };
  storage.setItem('amor-em-papel:cart:v2', '{invalid');
  assert.deepEqual(loadCart(storage), []);
  const items = addCartItem([], real, 2, { name: 'Lia' });
  saveCart(storage, items);
  assert.equal(loadCart(storage)[0].customization.name, 'Lia');
});
