import type { PropsWithChildren } from 'react';
import { AuthProvider } from '../features/auth/AuthProvider';
import { CartProvider } from '../features/cart/cart.store';
import { FavoritesProvider } from '../features/favorites/favorites.store';
export function AppProviders({ children }: PropsWithChildren) { return <AuthProvider><FavoritesProvider><CartProvider>{children}</CartProvider></FavoritesProvider></AuthProvider>; }
