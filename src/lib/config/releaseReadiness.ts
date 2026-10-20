import { normalizeBrazilPhone } from '../whatsapp/normalizePhone';
import type { Product } from '../../features/catalog/types';
import type { SiteConfig } from './siteConfig';

export type ReleaseReadiness = { ready: boolean; blockers: string[] };

export function getReleaseReadiness(config: SiteConfig, products: Product[]): ReleaseReadiness {
  const blockers: string[] = [];
  let validDomain = false;
  try {
    const url = new URL(config.baseUrl);
    validDomain = url.protocol === 'https:' && url.hostname.includes('.') && !url.username && !url.password;
  } catch {
    validDomain = false;
  }
  if (!validDomain) blockers.push('Definir domínio HTTPS real em VITE_SITE_BASE_URL.');
  if (!normalizeBrazilPhone(config.whatsappNumber)) blockers.push('Definir WhatsApp real e válido em VITE_WHATSAPP_NUMBER.');
  if (!config.supabaseUrl || !config.supabaseAnonKey) blockers.push('Conectar o projeto Supabase real antes do lançamento.');
  if (config.demoFallback) blockers.push('Desativar o fallback demonstrativo com VITE_ENABLE_DEMO_FALLBACK=false.');
  if (!products.length) blockers.push('Cadastrar ao menos um produto real e publicado.');
  if (products.some((product) => product.isDemo)) blockers.push('Substituir produtos demonstrativos pelos produtos reais da cliente.');
  if (products.some((product) => product.image.includes('/placeholders/'))) blockers.push('Substituir imagens demonstrativas por fotos reais.');
  return { ready: blockers.length === 0, blockers };
}
