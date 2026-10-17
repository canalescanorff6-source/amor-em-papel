import { readFileSync, readdirSync, statSync } from 'node:fs';
import { extname, join, relative } from 'node:path';

const roots = ['src', 'public'];
const textExtensions = new Set(['.ts', '.tsx', '.js', '.mjs', '.css', '.html', '.txt', '.json', '.svg']);
const files = [];

function walk(dir) {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    const stat = statSync(path);
    if (stat.isDirectory()) walk(path);
    else if (textExtensions.has(extname(path))) files.push(path);
  }
}
for (const root of roots) walk(root);

const blockers = [];
for (const file of files) {
  const content = readFileSync(file, 'utf8');
  const externalUrlSurface = content.replaceAll('http://www.w3.org/2000/svg', '');
  if (/SUPABASE_SERVICE_ROLE_KEY|sb_secret_[A-Za-z0-9_-]+/.test(content)) {
    blockers.push(`${relative('.', file)} contém referência a segredo de backend`);
  }
  if (/http:\/\//i.test(externalUrlSurface) && !/localhost|127\.0\.0\.1/.test(externalUrlSurface)) {
    blockers.push(`${relative('.', file)} contém URL HTTP externa`);
  }
  if (/\uFFFD/.test(content)) {
    blockers.push(`${relative('.', file)} contém caractere Unicode de substituição`);
  }
}

const whatsapp = readFileSync('src/lib/whatsapp/buildWaUrl.ts', 'utf8');
const encodeCount = (whatsapp.match(/encodeURIComponent\(/g) ?? []).length;
if (encodeCount !== 1) blockers.push(`buildWaUrl.ts deve aplicar encodeURIComponent exatamente uma vez; encontrado ${encodeCount}`);
if (!whatsapp.includes('https://wa.me/')) blockers.push('buildWaUrl.ts precisa usar endpoint HTTPS wa.me');

if (blockers.length) {
  console.error(`Auditoria de fonte falhou:\n- ${blockers.join('\n- ')}`);
  process.exit(1);
}
console.log(`Source audit OK (${files.length} arquivos verificados)`);
