import type { CartItem } from './cart.types.ts';

export const CART_STORAGE_KEY = 'amor-em-papel:cart:v2';

export interface StorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): unknown;
  removeItem(key: string): unknown;
}

function isCartItem(value: unknown): value is CartItem {
  if (!value || typeof value !== 'object') return false;
  const item = value as Partial<CartItem>;
  return typeof item.key === 'string' && typeof item.productId === 'string' && typeof item.productSlug === 'string' && typeof item.productName === 'string' && typeof item.quantity === 'number' && item.quantity > 0 && item.quantity <= 99 && (typeof item.unitPrice === 'number' || item.unitPrice === null) && typeof item.customization === 'object';
}

export function loadCart(storage: StorageLike): CartItem[] {
  try {
    const raw = storage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? parsed.filter(isCartItem) : [];
  } catch {
    storage.removeItem(CART_STORAGE_KEY);
    return [];
  }
}

export function saveCart(storage: StorageLike, items: CartItem[]): void {
  storage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
}
