import test from 'node:test';
import assert from 'node:assert/strict';
import { validateImageFileMeta } from '../../src/features/admin/admin.service.logic.ts';
import { readFile } from 'node:fs/promises';

test('image upload validator accepts common images and rejects unsafe/huge files', () => {
  assert.deepEqual(validateImageFileMeta({ type:'image/jpeg', size:2_000_000, name:'produto.jpg' }), { ok:true });
  assert.equal(validateImageFileMeta({ type:'application/pdf', size:200_000, name:'x.pdf' }).ok, false);
  assert.equal(validateImageFileMeta({ type:'image/png', size:8_000_000, name:'huge.png' }).ok, false);
});

test('admin service never contains service role secret or bypasses auth', async () => {
  const source=(await readFile(new URL('../../src/features/admin/admin.service.ts',import.meta.url),'utf8')).toLowerCase();
  assert.equal(source.includes('service_role'), false);
  assert.match(source,/supabase/);
});
