import test from 'node:test';
import assert from 'node:assert/strict';
import { mergeFavoriteIds } from '../../src/features/favorites/favorite-merge.ts';
import { filterOrdersForUser } from '../../src/features/orders/orders.service.logic.ts';

test('favorite merge is deterministic and duplicate free', () => {
  assert.deepEqual(mergeFavoriteIds(['p2','p1'], ['p1','p3','p2']), ['p2','p1','p3']);
  assert.deepEqual(mergeFavoriteIds([], ['p3','p3']), ['p3']);
});

test('ownership filter never leaks another customer order', () => {
  const orders = [{id:'1',user_id:'u1'},{id:'2',user_id:'u2'},{id:'3',user_id:'u1'}];
  assert.deepEqual(filterOrdersForUser(orders, 'u1').map((o)=>o.id), ['1','3']);
});
