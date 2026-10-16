import { normalizeBrazilPhone } from '../whatsapp/normalizePhone.ts';
export interface SiteConfig {
  brandName: string;
  siteUrl: string;
  whatsappNumber: string;
  instagramUrl: string;
  serviceRegion: string;
  supabaseUrl: string;
  supabaseAnonKey: string;
  isPreview: boolean;
}

type Env = Record<string, string | undefined>;

function normalizeConfiguredWhatsApp(value: string | undefined): string {
  if (!value) return '';
  try { return normalizeBrazilPhone(value); } catch { return value.replace(/\D/g, ''); }
}


function safeHttpsUrl(value: string | undefined): string {
  if (!value) return '';
  try {
    const url = new URL(value);
    return url.protocol === 'https:' ? url.toString().replace(/\/$/, '') : '';
  } catch {
    return '';
  }
}

export function buildSiteConfig(env: Env): SiteConfig {
  const siteUrl = safeHttpsUrl(env.VITE_SITE_URL);
  return {
    brandName: 'Amor em Papel',
    siteUrl,
    whatsappNumber: normalizeConfiguredWhatsApp(env.VITE_WHATSAPP_NUMBER),
    instagramUrl: safeHttpsUrl(env.VITE_INSTAGRAM_URL),
    serviceRegion: env.VITE_SERVICE_REGION?.trim() ?? '',
    supabaseUrl: safeHttpsUrl(env.VITE_SUPABASE_URL),
    supabaseAnonKey: env.VITE_SUPABASE_ANON_KEY?.trim() ?? '',
    isPreview: !siteUrl
  };
}

const runtimeEnv = ((import.meta as ImportMeta & { env?: Env }).env ?? {}) as Env;
export const siteConfig = buildSiteConfig(runtimeEnv);
