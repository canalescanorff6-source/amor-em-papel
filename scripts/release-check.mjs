const required = ['VITE_SITE_BASE_URL', 'VITE_WHATSAPP_NUMBER', 'VITE_SUPABASE_URL', 'VITE_SUPABASE_ANON_KEY'];
const blockers = [];

for (const key of required) {
  if (!process.env[key]?.trim()) blockers.push(`${key} não configurada`);
}

if (process.env.VITE_SITE_BASE_URL && !/^https:\/\//i.test(process.env.VITE_SITE_BASE_URL)) {
  blockers.push('VITE_SITE_BASE_URL precisa usar HTTPS');
}
if (process.env.VITE_ENABLE_DEMO_FALLBACK !== 'false') {
  blockers.push('VITE_ENABLE_DEMO_FALLBACK precisa ser false em produção');
}

if (blockers.length) {
  console.error(`Release bloqueado:\n- ${blockers.join('\n- ')}`);
  process.exit(1);
}

console.log('Release check OK');
