import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const read = (path) => readFile(new URL(`../../${path}`, import.meta.url), 'utf8');

test('initial migration defines required commerce tables without service role secrets', async () => {
  const sql = (await read('supabase/migrations/0001_initial_schema.sql')).toLowerCase();
  for (const table of ['profiles','categories','products','product_images','favorites','orders','order_items','appointments','availability']) {
    assert.match(sql, new RegExp(`create table(?: if not exists)? public\\.${table}`));
  }
  assert.equal(sql.includes('service_role'), false);
  assert.match(sql, /status text not null default 'pending'/);
});

test('RLS migration enables RLS and scopes customer/admin access', async () => {
  const sql = (await read('supabase/migrations/0002_rls_policies.sql')).toLowerCase();
  for (const table of ['profiles','categories','products','product_images','favorites','orders','order_items','appointments','availability']) {
    assert.match(sql, new RegExp(`alter table public\\.${table} enable row level security`));
  }
  assert.match(sql, /auth\.uid\(\)/);
  assert.match(sql, /public\.is_admin\(\)/);
  assert.match(sql, /is_active = true/);
  assert.match(sql, /status = 'pending'/);
  assert.equal(sql.includes('service_role'), false);
});

test('Supabase browser client references only URL and anon/publishable key', async () => {
  const source = (await read('src/lib/supabase/client.ts')).toLowerCase();
  assert.match(source, /supabaseanonkey/);
  assert.equal(source.includes('service_role'), false);
});
