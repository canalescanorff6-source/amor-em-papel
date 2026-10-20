import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { supabase } from '../../lib/supabase/client';

type Role = 'customer' | 'admin';
type RoleProof = { userId: string; role: Role };
type AuthValue = {
  user: User | null;
  session: Session | null;
  role: Role | null;
  loading: boolean;
  configured: boolean;
  signIn: (email: string, password: string) => Promise<string | null>;
  signUp: (email: string, password: string, fullName: string) => Promise<string | null>;
  signOut: () => Promise<void>;
};
const Ctx = createContext<AuthValue | null>(null);

// Autorização é sempre associada ao id do usuário que foi consultado.
// Uma resposta atrasada nunca pode transformar outra sessão em administrador.
export function verifiedRole(userId: string | null, proof: RoleProof | null): Role | null {
  return userId && proof?.userId === userId ? proof.role : null;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [roleProof, setRoleProof] = useState<RoleProof | null>(null);
  const [sessionLoading, setSessionLoading] = useState(Boolean(supabase));
  const activeUserId = session?.user.id ?? null;
  const role = verifiedRole(activeUserId, roleProof);
  const loading = sessionLoading || Boolean(supabase && activeUserId && !role);

  useEffect(() => {
    if (!supabase) { setSessionLoading(false); return; }
    let mounted = true;
    const { data: listener } = supabase.auth.onAuthStateChange((_event, currentSession) => {
      if (mounted) setSession(currentSession);
    });
    void supabase.auth.getSession().then(({ data }) => {
      if (mounted) setSession(data.session);
    }).catch(() => {
      if (mounted) setSession(null);
    }).finally(() => {
      if (mounted) setSessionLoading(false);
    });
    return () => { mounted = false; listener.subscription.unsubscribe(); };
  }, []);

  useEffect(() => {
    if (!supabase || !activeUserId) {
      setRoleProof(null);
      return;
    }
    const requestedUser = activeUserId;
    let cancelled = false;
    void supabase.from('profiles').select('role').eq('id', requestedUser).single()
      .then(({ data }) => {
        if (!cancelled) {
          setRoleProof({ userId: requestedUser, role: data?.role === 'admin' ? 'admin' : 'customer' });
        }
      })
      .catch(() => {
        if (!cancelled) setRoleProof({ userId: requestedUser, role: 'customer' });
      });
    return () => { cancelled = true; };
  }, [activeUserId]);

  const value = useMemo<AuthValue>(() => ({
    user: session?.user ?? null,
    session,
    role,
    loading,
    configured: Boolean(supabase),
    signIn: async (email, password) => {
      if (!supabase) return 'Backend ainda não configurado.';
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      return error?.message ?? null;
    },
    signUp: async (email, password, fullName) => {
      if (!supabase) return 'Backend ainda não configurado.';
      const { error } = await supabase.auth.signUp({
        email, password, options: { data: { full_name: fullName } },
      });
      return error?.message ?? null;
    },
    signOut: async () => {
      if (supabase) await supabase.auth.signOut();
    },
  }), [session, role, loading]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const value = useContext(Ctx);
  if (!value) throw new Error('useAuth must be used within AuthProvider');
  return value;
}
