import { Navigate, Route, Routes, useParams } from 'react-router-dom';
import { AppShell } from '../components/layout/AppShell';
import { CatalogPage } from '../pages/CatalogPage';
import { CategoriesPage } from '../pages/CategoriesPage';
import { CollectionPage } from '../pages/CollectionPage';
import { HomePage } from '../pages/HomePage';
import { ProductPage } from '../pages/ProductPage';
import { CartPage } from '../features/cart/CartPage';
import { FavoritesPage } from '../pages/FavoritesPage';
import { CheckoutPage } from '../features/checkout/CheckoutPage';
import { AccountPage } from '../features/account/AccountPage';
import { OrdersPage } from '../features/orders/OrdersPage';
import { RequireAuth } from '../features/auth/RequireAuth';
import { RequireAdmin } from '../features/auth/RequireAdmin';
import { AdminLayout } from '../features/admin/AdminLayout';
import { AdminDashboard } from '../features/admin/AdminDashboard';
import { ProductsAdminPage } from '../features/admin/ProductsAdminPage';
import { OrdersAdminPage } from '../features/admin/OrdersAdminPage';
import { ScheduleAdminPage } from '../features/admin/ScheduleAdminPage';
import { AppointmentPage } from '../features/scheduling/AppointmentPage';
import { SupportPage } from '../pages/SupportPage';
import { AboutPage } from '../pages/AboutPage';
import { PrivacyPage } from '../pages/PrivacyPage';
import { NotFoundPage } from '../pages/NotFoundPage';

function CategoryRoute() { const { slug = '' } = useParams(); return <CatalogPage category={slug} title={`Categoria: ${slug.replaceAll('-', ' ')}`} />; }

export function AppRoutes() {
  return <AppShell><Routes>
    <Route path="/" element={<HomePage />} />
    <Route path="/produtos" element={<CatalogPage />} />
    <Route path="/categorias" element={<CategoriesPage />} />
    <Route path="/categoria/:slug" element={<CategoryRoute />} />
    <Route path="/produto/:slug" element={<ProductPage />} />
    <Route path="/promocoes" element={<CollectionPage collection="featured" title="Promoções e oportunidades" description="Somente descontos reais serão publicados; por enquanto estes são modelos de demonstração." />} />
    <Route path="/mais-vendidos" element={<CollectionPage collection="featured" title="Mais procurados" description="A ordem real será baseada em dados da loja; o conteúdo atual é demonstrativo." />} />
    <Route path="/novidades" element={<CollectionPage collection="new" title="Novidades" description="Modelos demonstrativos recentes para visualizar a experiência da loja." />} />
    <Route path="/personalizados" element={<CatalogPage personalizable title="Produtos personalizados" />} />
    <Route path="/inspiracoes" element={<CollectionPage collection="inspiration" title="Inspirações criativas" description="Referências demonstrativas para ajudar a imaginar o pedido." />} />
    <Route path="/favoritos" element={<FavoritesPage />} />
    <Route path="/carrinho" element={<CartPage />} />
    <Route path="/checkout" element={<CheckoutPage />} />
    <Route path="/conta" element={<AccountPage />} />
    <Route path="/meus-pedidos" element={<RequireAuth><OrdersPage /></RequireAuth>} />
    <Route path="/admin" element={<RequireAdmin><AdminLayout><AdminDashboard /></AdminLayout></RequireAdmin>} />
    <Route path="/admin/produtos" element={<RequireAdmin><AdminLayout><ProductsAdminPage /></AdminLayout></RequireAdmin>} />
    <Route path="/admin/pedidos" element={<RequireAdmin><AdminLayout><OrdersAdminPage /></AdminLayout></RequireAdmin>} />
    <Route path="/admin/agenda" element={<RequireAdmin><AdminLayout><ScheduleAdminPage /></AdminLayout></RequireAdmin>} />
    <Route path="/agendamento" element={<AppointmentPage />} />
    <Route path="/atendimento" element={<SupportPage />} />
    <Route path="/sobre" element={<AboutPage />} />
    <Route path="/privacidade" element={<PrivacyPage />} />
    <Route path="/login" element={<Navigate to="/conta?login=1" replace />} />
    <Route path="/404" element={<NotFoundPage />} />
    <Route path="*" element={<Navigate to="/404" replace />} />
  </Routes></AppShell>;
}
