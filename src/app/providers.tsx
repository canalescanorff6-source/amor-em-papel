import { AuthProvider, useAuth } from '../features/auth/AuthProvider';
import { CartProvider } from '../features/cart/cart.store';
import { FavoritesProvider } from '../features/favorites/favorites.store';
import { CatalogProvider } from '../features/catalog/catalog.store';

function CustomerScopedProviders({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  // Não mostrar o carrinho de visitante enquanto a identidade logada é recuperada.
  if (loading) {
    return <main className="page-wrap" role="status" aria-live="polite">
      Carregando sua sessão...
    </main>;
  }

  // A troca de usuário destrói os estados da sessão anterior antes de
  // hidratar o carrinho e os favoritos exclusivos da nova identidade.
  const scope = user?.id ?? 'guest';
  return (
    <CatalogProvider>
      <FavoritesProvider key={scope}>
        <CartProvider key={scope}>{children}</CartProvider>
      </FavoritesProvider>
    </CatalogProvider>
  );
}

export function AppProviders({ children }: { children: React.ReactNode }) {
  return <AuthProvider><CustomerScopedProviders>{children}</CustomerScopedProviders></AuthProvider>;
}
