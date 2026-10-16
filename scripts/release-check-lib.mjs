export function releaseReadiness(env){
  const blockers=[]; const warnings=[];
  const url=env.VITE_SITE_URL||''; const phone=(env.VITE_WHATSAPP_NUMBER||'').replace(/\D/g,'');
  if(!/^https:\/\//.test(url)) blockers.push('VITE_SITE_URL precisa ser uma URL HTTPS definitiva.');
  if(!/^55\d{10,11}$/.test(phone)) blockers.push('VITE_WHATSAPP_NUMBER precisa conter DDI 55 + DDD + número.');
  if(!/^https:\/\/[^/]+\.supabase\.co\/?$/.test(env.VITE_SUPABASE_URL||'')) blockers.push('VITE_SUPABASE_URL não configurada.');
  if(!(env.VITE_SUPABASE_ANON_KEY||'').trim()) blockers.push('VITE_SUPABASE_ANON_KEY não configurada.');
  if(env.REAL_CATALOG_READY!=='true') blockers.push('REAL_CATALOG_READY ainda não está true; catálogo real não foi validado.');
  if(!(env.VITE_INSTAGRAM_URL||'').startsWith('https://')) warnings.push('Instagram oficial ainda não configurado.');
  if(!(env.VITE_SERVICE_REGION||'').trim()) warnings.push('Região de atendimento ainda não configurada.');
  return {ready:blockers.length===0,blockers,warnings};
}
