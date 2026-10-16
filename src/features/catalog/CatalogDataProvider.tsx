import { createContext, useContext, useEffect, useMemo, useState, type PropsWithChildren } from 'react';
import { categories as demoCategories, demoProducts } from '../../data/demoCatalog';
import { supabase } from '../../lib/supabase/client';
import { mapDbCategory, mapDbProduct, type DbCategoryRow, type DbProductRow } from './catalog.data';
import type { Category, Product } from './types';

export type CatalogSource = 'demo' | 'supabase';

interface CatalogDataValue {
  products: Product[];
  categories: Category[];
  loading: boolean;
  source: CatalogSource;
  error: string | null;
}

const CatalogDataContext = createContext<CatalogDataValue | null>(null);

export function CatalogDataProvider({ children }: PropsWithChildren) {
  const [value, setValue] = useState<CatalogDataValue>({
    products: demoProducts,
    categories: demoCategories,
    loading: Boolean(supabase),
    source: 'demo',
    error: null
  });

  useEffect(() => {
    if (!supabase) return;

    let cancelled = false;
    async function load() {
      try {
        const [categoryResult, productResult] = await Promise.all([
          supabase!
            .from('categories')
            .select('id,slug,name,description,icon,accent')
            .eq('is_active', true)
            .order('sort_order', { ascending: true }),
          supabase!
            .from('products')
            .select('*, categories(slug), product_images(storage_path,alt_text,is_primary,sort_order)')
            .eq('is_active', true)
            .order('created_at', { ascending: false })
        ]);

        if (categoryResult.error) throw categoryResult.error;
        if (productResult.error) throw productResult.error;
        if (cancelled) return;

        const realProducts = (productResult.data ?? []).map((row) =>
          mapDbProduct(row as DbProductRow, (path) =>
            supabase!.storage.from('product-media').getPublicUrl(path).data.publicUrl
          )
        );
        const realCategories = (categoryResult.data ?? []).map((row) => mapDbCategory(row as DbCategoryRow));

        if (realProducts.length > 0) {
          setValue({
            products: realProducts,
            categories: realCategories.length > 0 ? realCategories : demoCategories,
            loading: false,
            source: 'supabase',
            error: null
          });
        } else {
          setValue({
            products: demoProducts,
            categories: realCategories.length > 0 ? realCategories : demoCategories,
            loading: false,
            source: 'demo',
            error: null
          });
        }
      } catch (error) {
        if (!cancelled) {
          setValue({
            products: demoProducts,
            categories: demoCategories,
            loading: false,
            source: 'demo',
            error: error instanceof Error ? error.message : 'Não foi possível carregar o catálogo real.'
          });
        }
      }
    }

    void load();
    return () => { cancelled = true; };
  }, []);

  const contextValue = useMemo(() => value, [value]);
  return <CatalogDataContext.Provider value={contextValue}>{children}</CatalogDataContext.Provider>;
}

export function useCatalogData(): CatalogDataValue {
  const value = useContext(CatalogDataContext);
  if (!value) throw new Error('useCatalogData must be used inside CatalogDataProvider');
  return value;
}
