import type { PropsWithChildren } from 'react';
import { AuthProvider } from '../features/auth/AuthProvider';
import { CartProvider } from '../features/cart/cart.store';
import { CatalogDataProvider } from '../features/catalog/CatalogDataProvider';
import { FavoritesProvider } from '../features/favorites/favorites.store';

export function AppProviders({ children }: PropsWithChildren) {
  return (
    <AuthProvider>
      <CatalogDataProvider>
        <FavoritesProvider>
          <CartProvider>{children}</CartProvider>
        </FavoritesProvider>
      </CatalogDataProvider>
    </AuthProvider>
  );
}
