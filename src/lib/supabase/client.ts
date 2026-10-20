import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { hasSupabaseConfig, siteConfig } from '../config/siteConfig';
export const supabase:SupabaseClient|null = hasSupabaseConfig ? createClient(siteConfig.supabaseUrl,siteConfig.supabaseAnonKey,{auth:{persistSession:true,autoRefreshToken:true}}) : null;
