import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { Toaster } from './components/ui/sonner';
import CartModal from './components/Cart/CartModal';
import Footer from './components/Footer/Footer';
import Navbar from './components/Navbar/Navbar';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { MenuProvider } from './contexts/MenuContext';
import { Suspense, lazy } from 'react';

// Lazy-loaded pages — only loaded when the route is visited
const Home             = lazy(() => import('./Pages/Home'));
const Menu             = lazy(() => import('./Pages/Menu'));
const Checkout         = lazy(() => import('./Pages/Checkout'));
const Contact          = lazy(() => import('./Pages/Contact'));
const MobileApp        = lazy(() => import('./Pages/MobileApp'));
const OrderConfirmation = lazy(() => import('./Pages/OrderConfirmation'));
const RestaurantDetail  = lazy(() => import('./Pages/RestaurantDetail'));
const RestaurantsPage   = lazy(() => import('./Pages/RestaurantsPage'));

// Dashboard pages
const DashboardLayout = lazy(() => import('./components/Dashboard/DashboardLayout'));
const ProfilePage     = lazy(() => import('./Pages/Dashboard/ProfilePage'));
const OrdersPage      = lazy(() => import('./Pages/Dashboard/OrdersPage'));
const AddressesPage   = lazy(() => import('./Pages/Dashboard/AddressesPage'));
const FavoritesPage   = lazy(() => import('./Pages/Dashboard/FavoritesPage'));

// Full-page skeleton shown during lazy-load transitions
const PageSkeleton = () => (
  <div className="min-h-screen flex items-center justify-center bg-white">
    <div className="flex flex-col items-center gap-4">
      <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
      <p className="text-gray-500 text-sm font-medium">Loading…</p>
    </div>
  </div>
);

// Protected Route — uses localStorage for now; see AuthContext for full integration
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('token') !== null;
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  return children;
};

// Tiny wrapper that sets <title> for SEO without a third-party lib
const PageTitle = ({ title, children }) => {
  if (typeof document !== 'undefined') {
    document.title = title ? `${title} | HungerHive` : 'HungerHive – Food Delivery';
  }
  return children;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <MenuProvider>
          <CartProvider>
            <div className="min-h-screen flex flex-col">
              <Suspense fallback={<PageSkeleton />}>
                <Routes>
                  {/* ── Dashboard Routes ────────────────────────────────── */}
                  <Route path="/dashboard" element={
                    <ProtectedRoute>
                      <DashboardLayout><ProfilePage /></DashboardLayout>
                    </ProtectedRoute>
                  } />
                  <Route path="/dashboard/profile" element={
                    <ProtectedRoute>
                      <DashboardLayout><ProfilePage /></DashboardLayout>
                    </ProtectedRoute>
                  } />
                  <Route path="/dashboard/orders" element={
                    <ProtectedRoute>
                      <DashboardLayout><OrdersPage /></DashboardLayout>
                    </ProtectedRoute>
                  } />
                  <Route path="/dashboard/addresses" element={
                    <ProtectedRoute>
                      <DashboardLayout><AddressesPage /></DashboardLayout>
                    </ProtectedRoute>
                  } />
                  <Route path="/dashboard/favorites" element={
                    <ProtectedRoute>
                      <DashboardLayout><FavoritesPage /></DashboardLayout>
                    </ProtectedRoute>
                  } />

                  {/* ── Public Routes ────────────────────────────────────── */}
                  <Route path="/" element={
                    <PageTitle title="Home">
                      <><Navbar /><main className="flex-grow"><Home /></main><Footer /></>
                    </PageTitle>
                  } />

                  <Route path="/menu" element={
                    <PageTitle title="Menu">
                      <><Navbar /><main className="flex-grow"><Menu /></main><Footer /></>
                    </PageTitle>
                  } />

                  <Route path="/checkout" element={
                    <ProtectedRoute>
                      <PageTitle title="Checkout">
                        <><Navbar /><main className="flex-grow"><Checkout /></main><Footer /></>
                      </PageTitle>
                    </ProtectedRoute>
                  } />

                  <Route path="/order-confirmation/:orderId" element={
                    <PageTitle title="Order Confirmed">
                      <><Navbar /><main className="flex-grow"><OrderConfirmation /></main><Footer /></>
                    </PageTitle>
                  } />

                  <Route path="/restaurants" element={
                    <PageTitle title="Restaurants">
                      <><Navbar /><main className="flex-grow"><RestaurantsPage /></main><Footer /></>
                    </PageTitle>
                  } />

                  <Route path="/restaurants/:restaurantId" element={
                    <PageTitle title="Restaurant">
                      <><Navbar /><main className="flex-grow"><RestaurantDetail /></main><Footer /></>
                    </PageTitle>
                  } />

                  <Route path="/contact" element={
                    <PageTitle title="Contact Us">
                      <><Navbar /><main className="flex-grow"><Contact /></main><Footer /></>
                    </PageTitle>
                  } />

                  <Route path="/mobile-app" element={
                    <PageTitle title="Mobile App">
                      <><Navbar /><main className="flex-grow"><MobileApp /></main><Footer /></>
                    </PageTitle>
                  } />

                  {/* ── 404 ──────────────────────────────────────────────── */}
                  <Route path="*" element={
                    <PageTitle title="Page Not Found">
                      <>
                        <Navbar />
                        <main className="flex-grow">
                          <div className="container mx-auto px-4 py-16 text-center">
                            <h1 className="text-3xl font-bold mb-4">Page Not Found</h1>
                            <p>The page you're looking for doesn't exist.</p>
                          </div>
                        </main>
                        <Footer />
                      </>
                    </PageTitle>
                  } />
                </Routes>
              </Suspense>

              <CartModal />
              <Toaster
                position="bottom-right"
                richColors
                closeButton
                expand={false}
                duration={3000}
                toastOptions={{ style: { fontFamily: 'inherit' } }}
              />
            </div>
          </CartProvider>
        </MenuProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;