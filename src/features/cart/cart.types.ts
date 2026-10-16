import type { Product } from '../catalog/types';

export type CustomizationSnapshot = Record<string, string>;

export interface CartItem {
  key: string;
  productId: string;
  productSlug: string;
  productName: string;
  imageUrl: string;
  unitPrice: number | null;
  quantity: number;
  isDemo: boolean;
  personalizable: boolean;
  customization: CustomizationSnapshot;
}

export type AddableProduct = Pick<Product, 'id' | 'slug' | 'name' | 'imageUrl' | 'price' | 'isDemo' | 'personalizable'>;
