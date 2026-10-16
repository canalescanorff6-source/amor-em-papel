import type { Session, User } from '@supabase/supabase-js';
import { createContext, useContext, useEffect, useMemo, useState, type PropsWithChildren } from 'react';
import { supabase, supabaseEnabled } from '../../lib/supabase/client';

export type UserRole = 'customer' | 'admin';
export interface AuthValue {
  user: User | null;
  session: Session | null;
  role: UserRole | null;
  loading: boolean;
  enabled: boolean;
  signIn: (email: string, password: string) => Promise<string | null>;
  signUp: (email: string, password: string, fullName: string) => Promise<string | null>;
  signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthValue | null>(null);

async function fetchRole(userId: string): Promise<UserRole> {
  if (!supabase) return 'customer';
  const { data } = await supabase.from('profiles').select('role').eq('id', userId).maybeSingle();
  return data?.role === 'admin' ? 'admin' : 'customer';
}

export function AuthProvider({ children }: PropsWithChildren) {
  const [session,setSession]=useState<Session|null>(null); const [role,setRole]=useState<UserRole|null>(null); const [loading,setLoading]=useState(supabaseEnabled);
  useEffect(()=>{ if(!supabase){ setLoading(false); return; } let mounted=true; supabase.auth.getSession().then(async({data})=>{ if(!mounted)return; setSession(data.session); setRole(data.session?.user ? await fetchRole(data.session.user.id) : null); setLoading(false); }); const {data:listener}=supabase.auth.onAuthStateChange(async(_event,next)=>{ setSession(next); setRole(next?.user ? await fetchRole(next.user.id) : null); setLoading(false); }); return()=>{ mounted=false; listener.subscription.unsubscribe(); }; },[]);
  const value=useMemo<AuthValue>(()=>({ user:session?.user??null, session, role, loading, enabled:supabaseEnabled, signIn:async(email,password)=>{ if(!supabase)return 'Backend ainda não configurado.'; const {error}=await supabase.auth.signInWithPassword({email,password}); return error?.message??null; }, signUp:async(email,password,fullName)=>{ if(!supabase)return 'Backend ainda não configurado.'; const {error}=await supabase.auth.signUp({email,password,options:{data:{full_name:fullName}}}); return error?.message??null; }, signOut:async()=>{ if(supabase) await supabase.auth.signOut(); } }),[session,role,loading]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(){ const value=useContext(AuthContext); if(!value) throw new Error('useAuth must be used inside AuthProvider'); return value; }
