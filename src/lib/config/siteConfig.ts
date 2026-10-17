export type SiteConfig = {
  brandName: string;
  baseUrl: string;
  whatsappNumber: string;
  instagramUrl: string;
  serviceRegion: string;
  supabaseUrl: string;
  supabaseAnonKey: string;
  demoFallback: boolean;
};

const clean = (value: string | undefined) => (value ?? '').trim();
export const siteConfig: SiteConfig = {
  brandName: 'Amor em Papel',
  baseUrl: clean(import.meta.env.VITE_SITE_BASE_URL),
  whatsappNumber: clean(import.meta.env.VITE_WHATSAPP_NUMBER),
  instagramUrl: clean(import.meta.env.VITE_INSTAGRAM_URL),
  serviceRegion: clean(import.meta.env.VITE_SERVICE_REGION),
  supabaseUrl: clean(import.meta.env.VITE_SUPABASE_URL),
  supabaseAnonKey: clean(import.meta.env.VITE_SUPABASE_ANON_KEY),
  demoFallback: clean(import.meta.env.VITE_ENABLE_DEMO_FALLBACK).toLowerCase() !== 'false',
};

export const hasSupabaseConfig = Boolean(siteConfig.supabaseUrl && siteConfig.supabaseAnonKey);
