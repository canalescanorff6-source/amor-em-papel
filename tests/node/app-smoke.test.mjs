import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

const root = new URL('../../', import.meta.url);

test('App renders Amor em Papel brand source', async () => {
  const appPath = join(root.pathname, 'src/app/App.tsx');
  const source = await readFile(appPath, 'utf8');
  assert.match(source, /Amor em Papel/);
});
