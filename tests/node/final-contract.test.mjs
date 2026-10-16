import test from 'node:test';import assert from 'node:assert/strict';import {readFile} from 'node:fs/promises';
const read=(p)=>readFile(new URL(`../../${p}`,import.meta.url),'utf8');
test('public routes have real pages instead of implementation placeholders',async()=>{const routes=await read('src/app/routes.tsx');assert.equal(routes.includes('Esta área será conectada'),false);for(const name of ['SupportPage','AboutPage','PrivacyPage','NotFoundPage'])assert.ok(routes.includes(name));});
test('single professional scheduling prevents two confirmed records on the same slot',async()=>{const sql=(await read('supabase/migrations/0001_initial_schema.sql')).toLowerCase();assert.match(sql,/capacity integer not null default 1 check \(capacity = 1\)/);assert.match(sql,/unique index[^\n]+confirmed_slot[^\n]+where status = 'confirmed'/);});
test('reduced motion contract exists',async()=>{const css=await read('src/styles/index.css');assert.match(css,/prefers-reduced-motion/);});
