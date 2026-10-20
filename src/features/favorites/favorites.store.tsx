import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useAuth } from '../auth/AuthProvider';
import { supabase } from '../../lib/supabase/client';
import { loadFavorites, saveFavorites } from './favorites.storage';

const isUuid = (id: string) => /^[0-9a-f]{8}-[0-9a-f-]{27}$/i.test(id);
type FavoritesValue = { ids: string[]; toggle: (id: string) => void; has: (id: string) => boolean };
const Ctx = createContext<FavoritesValue | null>(null);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const auth = useAuth();
  const userId = auth.user?.id ?? null;
  const synced = useRef<string | null>(null);
  const [ids, setIds] = useState<string[]>(() => loadFavorites(userId));

  useEffect(() => { saveFavorites(ids, userId); }, [ids, userId]);

  useEffect(() => {
    if (!supabase || !userId || synced.current === userId) return;
    const activeUserId = userId;
    let cancelled = false;
    void (async () => {
      const { data } = await supabase!
        .from('favorites')
        .select('product_id')
        .eq('user_id', activeUserId);
      if (cancelled) return;
      const remote = (data ?? []).map(row => String(row.product_id));
      // Mesclar apenas itens que já pertencem à MESMA conta.
      setIds(current => [...new Set([...current, ...remote])]);
      const local = ids.filter(isUuid).map(product_id => ({
        user_id: activeUserId,
        product_id,
      }));
      synced.current = activeUserId;
      if (local.length) {
        await supabase!.from('favorites').upsert(local, {
          onConflict: 'user_id,product_id',
        });
      }
    })();
    return () => { cancelled = true; };
  }, [userId]);

  const toggle = (id: string) => {
    const removing = ids.includes(id);
    setIds(current => removing ? current.filter(value => value !== id) : [...current, id]);
    if (supabase && userId && isUuid(id)) {
      if (removing) {
        void supabase.from('favorites').delete()
          .eq('user_id', userId).eq('product_id', id).then(() => {});
      } else {
        void supabase.from('favorites').upsert({
          user_id: userId, product_id: id,
        }, { onConflict: 'user_id,product_id' }).then(() => {});
      }
    }
  };

  const value = useMemo<FavoritesValue>(
    () => ({ ids, toggle, has: (id: string) => ids.includes(id) }),
    [ids, userId],
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useFavorites() {
  const value = useContext(Ctx);
  if (!value) throw new Error('useFavorites must be used within FavoritesProvider');
  return value;
}
