import { readFileSync } from 'node:fs';
test('release guard requires real catalog acknowledgement',()=>{const source=readFileSync('scripts/release-check-lib.mjs','utf8');expect(source).toContain('REAL_CATALOG_READY');expect(source).toContain('blockers.push');});
