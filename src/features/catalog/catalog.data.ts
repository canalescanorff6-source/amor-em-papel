import type { Category, Product } from './types';

export interface DbCategoryRow {
  id: string;
  slug: string;
  name: string;
  description?: string | null;
  icon?: string | null;
  accent?: string | null;
}

export interface DbProductImageRow {
  storage_path: string;
  alt_text?: string | null;
  is_primary?: boolean | null;
  sort_order?: number | null;
}

export interface DbProductRow {
  id: string;
  slug: string;
  name: string;
  category_id?: string | null;
  short_description?: string | null;
  description?: string | null;
  price?: number | string | null;
  compare_at_price?: number | string | null;
  stock_status?: string | null;
  personalizable?: boolean | null;
  customization_fields?: unknown;
  tags?: string[] | null;
  collections?: string[] | null;
  is_demo?: boolean | null;
  is_active?: boolean | null;
  created_at?: string | null;
  categories?: { slug?: string | null } | Array<{ slug?: string | null }> | null;
  product_images?: DbProductImageRow[] | null;
}

const accents = new Set<Category['accent']>(['pink', 'blue', 'yellow', 'turquoise', 'lilac']);
const collections = new Set<Product['collections'][number]>(['featured', 'new', 'inspiration', 'custom']);
const customFields = new Set<NonNullable<Product['customizationFields']>[number]>(['name', 'age', 'theme', 'colors', 'notes']);

function numberOrNull(value: unknown): number | null {
  if (value === null || value === undefined || value === '') return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : null;
}

function categorySlug(row: DbProductRow): string {
  const nested = Array.isArray(row.categories) ? row.categories[0] : row.categories;
  return nested?.slug?.trim() || 'sem-categoria';
}

export function mapDbCategory(row: DbCategoryRow): Category {
  const accent = accents.has(row.accent as Category['accent']) ? row.accent as Category['accent'] : 'pink';
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    description: row.description?.trim() || '',
    icon: row.icon?.trim() || 'Sparkles',
    accent
  };
}

export function mapDbProduct(row: DbProductRow, publicImageUrl: (path: string) => string): Product {
  const images = [...(row.product_images ?? [])].sort((a, b) =>
    Number(Boolean(b.is_primary)) - Number(Boolean(a.is_primary)) ||
    (a.sort_order ?? 0) - (b.sort_order ?? 0)
  );
  const primary = images[0];
  const fields = Array.isArray(row.customization_fields)
    ? row.customization_fields.filter((value): value is NonNullable<Product['customizationFields']>[number] =>
        typeof value === 'string' && customFields.has(value as NonNullable<Product['customizationFields']>[number])
      )
    : [];
  const mappedCollections = (row.collections ?? []).filter((value): value is Product['collections'][number] =>
    collections.has(value as Product['collections'][number])
  );

  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    categoryId: row.category_id ?? '',
    categorySlug: categorySlug(row),
    shortDescription: row.short_description?.trim() || '',
    description: row.description?.trim() || '',
    imageUrl: primary?.storage_path ? publicImageUrl(primary.storage_path) : '/logo-amor-em-papel.jpg',
    imageAlt: primary?.alt_text?.trim() || `${row.name} — Amor em Papel`,
    tags: row.tags ?? [],
    price: numberOrNull(row.price),
    compareAtPrice: numberOrNull(row.compare_at_price),
    stockStatus: row.stock_status === 'available' || row.stock_status === 'unavailable' ? row.stock_status : 'unknown',
    personalizable: Boolean(row.personalizable),
    isDemo: Boolean(row.is_demo),
    isActive: row.is_active !== false,
    createdAt: row.created_at || new Date(0).toISOString(),
    collections: mappedCollections,
    customizationFields: fields
  };
}
