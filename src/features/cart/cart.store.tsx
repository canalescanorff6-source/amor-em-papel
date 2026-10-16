import { createContext, useContext, useEffect, useMemo, useState, type PropsWithChildren } from 'react';
import type { Product } from '../catalog/types';
import type { CartItem, CustomizationSnapshot } from './cart.types';
import { addCartItem, cartCount, cartSubtotal, removeCartItem, updateCartQuantity } from './cart.store.logic';
import { loadCart, saveCart } from './cart.storage';

type CartContextValue = {
  items: CartItem[];
  count: number;
  subtotal: number;
  add: (product: Product, quantity?: number, customization?: CustomizationSnapshot) => void;
  updateQuantity: (key: string, quantity: number) => void;
  remove: (key: string) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: PropsWithChildren) {
  const [items, setItems] = useState<CartItem[]>(() => typeof window === 'undefined' ? [] : loadCart(window.localStorage));
  useEffect(() => { if (typeof window !== 'undefined') saveCart(window.localStorage, items); }, [items]);
  const value = useMemo<CartContextValue>(() => ({
    items,
    count: cartCount(items),
    subtotal: cartSubtotal(items),
    add: (product, quantity = 1, customization = {}) => setItems((current) => addCartItem(current, product, quantity, customization)),
    updateQuantity: (key, quantity) => setItems((current) => updateCartQuantity(current, key, quantity)),
    remove: (key) => setItems((current) => removeCartItem(current, key)),
    clear: () => setItems([])
  }), [items]);
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const value = useContext(CartContext);
  if (!value) throw new Error('useCart must be used inside CartProvider');
  return value;
}
