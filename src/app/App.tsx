import { AppProviders } from './providers';
import { AppRoutes } from './routes';
export const APP_BRAND = 'Amor em Papel';
export function App() { return <AppProviders><div data-brand={APP_BRAND}><AppRoutes /></div></AppProviders>; }
