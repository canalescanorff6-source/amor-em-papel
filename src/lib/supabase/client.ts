import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { siteConfig } from '../config/siteConfig';

export const supabaseEnabled = Boolean(siteConfig.supabaseUrl && siteConfig.supabaseAnonKey);

export const supabase: SupabaseClient | null = supabaseEnabled
  ? createClient(siteConfig.supabaseUrl, siteConfig.supabaseAnonKey, {
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
    })
  : null;
