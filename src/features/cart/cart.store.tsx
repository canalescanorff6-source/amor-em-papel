import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import type { Product } from '../catalog/types';
import type { CartCustomization, CartItem } from './cart.types';
import { loadCart, saveCart } from './cart.storage';
import { useAuth } from '../auth/AuthProvider';
import { supabase } from '../../lib/supabase/client';

type CartContextValue = {
  items: CartItem[];
  count: number;
  subtotal: number | null;
  add: (product: Product, quantity?: number, customization?: CartCustomization) => void;
  remove: (id: string) => void;
  setQuantity: (id: string, quantity: number) => void;
  clear: () => void;
};

const Ctx = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const auth = useAuth();
  const userId = auth.user?.id ?? null;
  // AppProviders remonta este provider quando muda a identidade.
  // A cesta de um cliente nunca será carregada para a conta seguinte.
  const [items, setItems] = useState<CartItem[]>(() => loadCart(userId).items);
  const synced = useRef<string | null>(null);
  const persist = (next: CartItem[]) => {
    saveCart({ version: 1, items: next }, userId);
    return next;
  };

  useEffect(() => {
    saveCart({ version: 1, items }, userId);
    if (supabase && userId && synced.current === userId) {
      void supabase
        .from('carts')
        .upsert(
          { user_id: userId, items, updated_at: new Date().toISOString() },
          { onConflict: 'user_id' },
        )
        .then(() => {});
    }
  }, [items, userId]);

  useEffect(() => {
    if (!supabase || !userId || synced.current === userId) return;
    const activeUserId = userId;
    let cancelled = false;
    void (async () => {
      const { data } = await supabase!
        .from('carts')
        .select('items')
        .eq('user_id', activeUserId)
        .maybeSingle();
      if (cancelled) return;
      // Carrinho persistido no próprio namespace deste usuário.
      // Não migrar automaticamente a cesta de um visitante/outra conta.
      if (items.length === 0 && Array.isArray(data?.items)) {
        setItems(persist(data.items as CartItem[]));
      }
      synced.current = activeUserId;
    })();
    return () => { cancelled = true; };
  }, [userId]);

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      count: items.reduce((sum, item) => sum + item.quantity, 0),
      subtotal: items.some(item => item.product.price === null)
        ? null
        : items.reduce((sum, item) => sum + (item.product.price ?? 0) * item.quantity, 0),
      add: (product, quantity = 1, customization) =>
        setItems(current => {
          const key = `${product.id}:${customization?.summary ?? ''}`;
          const found = current.find(item => item.id === key);
          const next = found
            ? current.map(item => item.id === key
              ? { ...item, quantity: item.quantity + quantity }
              : item)
            : [...current, { id: key, product, quantity, customization }];
          return persist(next);
        }),
      remove: id => setItems(current => persist(current.filter(item => item.id !== id))),
      setQuantity: (id, quantity) =>
        setItems(current => persist(quantity <= 0
          ? current.filter(item => item.id !== id)
          : current.map(item => item.id === id ? { ...item, quantity } : item))),
      clear: () => setItems(() => persist([])),
    }),
    [items, userId],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCart() {
  const value = useContext(Ctx);
  if (!value) throw new Error('useCart must be used inside CartProvider');
  return value;
}
