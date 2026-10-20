import type { StoredCart } from './cart.types';

// A chave histórica continua exclusiva do visitante, preservando a cesta
// já salva antes desta versão. Cada conta recebe seu próprio namespace.
const GUEST_KEY = 'amor-em-papel:cart:v1';
export function getCartStorageKey(userId: string | null = null): string {
  return userId ? `amor-em-papel:cart:user:${encodeURIComponent(userId)}:v1` : GUEST_KEY;
}

export function loadCart(userId: string | null = null): StoredCart {
  try {
    const raw = localStorage.getItem(getCartStorageKey(userId));
    if (!raw) return { version: 1, items: [] };
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return { version: 1, items: [] };
    const cart = parsed as StoredCart;
    if (cart.version !== 1 || !Array.isArray(cart.items)) return { version: 1, items: [] };
    return cart;
  } catch {
    return { version: 1, items: [] };
  }
}

export function saveCart(cart: StoredCart, userId: string | null = null): void {
  try {
    localStorage.setItem(getCartStorageKey(userId), JSON.stringify(cart));
  } catch {
    // Navegação privada ou cota excedida: o estado permanece em memória.
  }
}

export const CART_STORAGE_KEY = GUEST_KEY;
