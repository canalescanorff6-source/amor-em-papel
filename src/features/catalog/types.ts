export type ProductStockStatus = 'available' | 'unavailable' | 'unknown';

export interface Category {
  id: string;
  slug: string;
  name: string;
  description: string;
  icon: string;
  accent: 'pink' | 'blue' | 'yellow' | 'turquoise' | 'lilac';
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  categoryId: string;
  categorySlug: string;
  shortDescription: string;
  description: string;
  imageUrl: string;
  imageAlt: string;
  tags: string[];
  price: number | null;
  compareAtPrice: number | null;
  stockStatus: ProductStockStatus;
  personalizable: boolean;
  isDemo: boolean;
  isActive: boolean;
  createdAt: string;
  collections: Array<'featured' | 'new' | 'inspiration' | 'custom'>;
  customizationFields?: Array<'name' | 'age' | 'theme' | 'colors' | 'notes'>;
}
