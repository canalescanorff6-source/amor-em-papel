import type { AddableProduct, CartItem, CustomizationSnapshot } from './cart.types.ts';

function normalizeCustomization(input: CustomizationSnapshot): CustomizationSnapshot {
  return Object.fromEntries(Object.entries(input).map(([key, value]) => [key, value.trim()]).filter(([, value]) => value !== '').sort(([a], [b]) => a.localeCompare(b)));
}

function makeKey(productId: string, customization: CustomizationSnapshot): string {
  return `${productId}:${JSON.stringify(normalizeCustomization(customization))}`;
}

export function addCartItem(items: CartItem[], product: AddableProduct, quantity = 1, customization: CustomizationSnapshot = {}): CartItem[] {
  const safeQuantity = Math.max(1, Math.min(99, Math.trunc(quantity || 1)));
  const snapshot = normalizeCustomization(customization);
  const key = makeKey(product.id, snapshot);
  const existing = items.find((item) => item.key === key);
  if (existing) return items.map((item) => item.key === key ? { ...item, quantity: Math.min(99, item.quantity + safeQuantity) } : item);
  return [...items, { key, productId: product.id, productSlug: product.slug, productName: product.name, imageUrl: product.imageUrl, unitPrice: product.price, quantity: safeQuantity, isDemo: product.isDemo, personalizable: product.personalizable, customization: snapshot }];
}

export function updateCartQuantity(items: CartItem[], key: string, quantity: number): CartItem[] {
  const next = Math.trunc(quantity);
  if (next <= 0) return removeCartItem(items, key);
  return items.map((item) => item.key === key ? { ...item, quantity: Math.min(99, next) } : item);
}

export function removeCartItem(items: CartItem[], key: string): CartItem[] {
  return items.filter((item) => item.key !== key);
}

export function cartSubtotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + (item.unitPrice ?? 0) * item.quantity, 0);
}

export function cartCount(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.quantity, 0);
}
