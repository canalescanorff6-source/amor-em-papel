// Pré-validação de configuração para deploy. Não substitui QA do banco e do site em produção.
const required = [
  'VITE_SITE_BASE_URL',
  'VITE_WHATSAPP_NUMBER',
  'VITE_SUPABASE_URL',
  'VITE_SUPABASE_ANON_KEY',
];

const blockers = [];
const values = Object.fromEntries(required.map(key => [key, (process.env[key] ?? '').trim()]));

for (const key of required) {
  if (!values[key]) blockers.push(key + ' não configurada');
}

function isHttpsOrigin(value) {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' &&
      url.hostname.includes('.') &&
      !url.username && !url.password &&
      !url.search && !url.hash && (url.pathname === '/' || url.pathname === '');
  } catch {
    return false;
  }
}

function isBrazilPhone(value) {
  if (!/^\+?[\d\s().-]+$/.test(value) || (value.startsWith('+') && !value.startsWith('+55'))) {
    return false;
  }
  const digits = value.replace(/\D/g, '');
  const national = digits.startsWith('55') && (digits.length === 12 || digits.length === 13)
    ? digits.slice(2)
    : digits;
  if (national.length !== 10 && national.length !== 11) return false;
  const ddd = Number(national.slice(0, 2));
  const subscriber = national.slice(2);
  return ddd >= 11 && ddd <= 99 && !/^(\d)\1+$/.test(subscriber);
}

if (values.VITE_SITE_BASE_URL && !isHttpsOrigin(values.VITE_SITE_BASE_URL)) {
  blockers.push('VITE_SITE_BASE_URL precisa ser uma origem HTTPS válida, sem caminho ou credenciais');
}
if (values.VITE_SUPABASE_URL && !isHttpsOrigin(values.VITE_SUPABASE_URL)) {
  blockers.push('VITE_SUPABASE_URL precisa ser uma origem HTTPS válida');
}
if (values.VITE_WHATSAPP_NUMBER && !isBrazilPhone(values.VITE_WHATSAPP_NUMBER)) {
  blockers.push('VITE_WHATSAPP_NUMBER precisa ser um contato brasileiro válido com DDD');
}
if (process.env.VITE_ENABLE_DEMO_FALLBACK !== 'false') {
  blockers.push('VITE_ENABLE_DEMO_FALLBACK precisa ser false em produção');
}

if (blockers.length) {
  console.error('Release bloqueado:\n- ' + blockers.join('\n- '));
  process.exit(1);
}

console.log('Checagem de configuração OK. Valide separadamente Supabase, catálogo real, fotos, RLS, WhatsApp e Cloudflare antes do lançamento.');
