import type { Product } from '../../features/catalog/types.ts';
import type { SiteConfig } from './siteConfig.ts';

export interface ReleaseReadiness {
  ready: boolean;
  blockers: string[];
  warnings: string[];
}

export function getReleaseReadiness(config: SiteConfig, products: Product[]): ReleaseReadiness {
  const blockers: string[] = [];
  const warnings: string[] = [];

  if (!/^55\d{10,11}$/.test(config.whatsappNumber)) blockers.push('WhatsApp oficial da loja não configurado ou inválido.');
  if (!config.siteUrl) blockers.push('domínio HTTPS definitivo não configurado.');
  if (!products.some((product) => product.isActive && !product.isDemo)) blockers.push('Nenhum produto real ativo foi cadastrado; o catálogo ainda é demonstração.');
  if (!config.instagramUrl) warnings.push('Instagram oficial ainda não configurado.');
  if (!config.serviceRegion) warnings.push('Região de atendimento ainda não configurada.');
  if (!config.supabaseUrl || !config.supabaseAnonKey) warnings.push('Supabase ainda não conectado; recursos de conta/admin usam modo de demonstração.');

  return { ready: blockers.length === 0, blockers, warnings };
}
