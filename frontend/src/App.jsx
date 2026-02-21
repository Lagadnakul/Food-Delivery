import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CartModal from './components/Cart/CartModal';
import Footer from './components/Footer/Footer';
import Navbar from './components/Navbar/Navbar';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { MenuProvider } from './contexts/MenuContext';
import Checkout from './Pages/Checkout';
import Contact from './Pages/Contact';
import Home from './Pages/Home';
import Menu from './Pages/Menu';
import MobileApp from './Pages/MobileApp';
import OrderConfirmation from './Pages/OrderConfirmation';
import RestaurantDetail from './Pages/RestaurantDetail';
import RestaurantsPage from './Pages/RestaurantsPage';
import './styles/toast.css';

// Import Dashboard Components
import DashboardLayout from './components/Dashboard/DashboardLayout';
import AddressesPage from './Pages/Dashboard/AddressesPage';
import FavoritesPage from './Pages/Dashboard/FavoritesPage';
import OrdersPage from './Pages/Dashboard/OrdersPage';
import ProfilePage from './Pages/Dashboard/ProfilePage';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('token') !== null;
  
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
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
              <Routes>
                {/* Dashboard Routes */}
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <ProfilePage />
                    </DashboardLayout>
                  </ProtectedRoute>
                } />
                
                <Route path="/dashboard/profile" element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <ProfilePage />
                    </DashboardLayout>
                  </ProtectedRoute>
                } />
              
              <Route path="/dashboard/orders" element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <OrdersPage />
                  </DashboardLayout>
                </ProtectedRoute>
              } />
              
              <Route path="/dashboard/addresses" element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <AddressesPage />
                  </DashboardLayout>
                </ProtectedRoute>
              } />
              
              <Route path="/dashboard/favorites" element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <FavoritesPage />
                  </DashboardLayout>
                </ProtectedRoute>
              } />
              
              {/* Regular application routes with Navbar and Footer */}
              <Route path="/" element={
                <>
                  <Navbar />
                  <main className="flex-grow">
                    <Home />
                  </main>
                  <Footer />
                </>
              } />

              <Route path="/menu" element={
                <>
                  <Navbar />
                  <main className="flex-grow">
                    <Menu />
                  </main>
                  <Footer />
                </>
              } />
              <Route path="/checkout" element={
                <>
                  <Navbar />
                  <main className="flex-grow">
                    <Checkout />
                  </main>
                  <Footer />
                </>
              } />
              <Route path="/order-confirmation/:orderId" element={
                <>
                  <Navbar />
                  <main className="flex-grow">
                    <OrderConfirmation />
                  </main>
                  <Footer />
                </>
              } />
              <Route path="/restaurants" element={
                <>
                  <Navbar />
                  <main className="flex-grow">
                    <RestaurantsPage />
                  </main>
                  <Footer />
                </>
              } />
              <Route path="/restaurants/:restaurantId" element={
                <>
                  <Navbar />
                  <main className="flex-grow">
                    <RestaurantDetail />
                  </main>
                  <Footer />
                </>
              } />
              <Route path="/mobile-app" element={
                <>
                  <Navbar />
                  <main className="flex-grow">
                    <MobileApp />
                  </main>
                  <Footer />
                </>
              } />
              <Route path="/contact" element={
                <>
                  <Navbar />
                  <main className="flex-grow">
                    <Contact />
                  </main>
                  <Footer />
                </>
              } />
              
              {/* 404 catch-all route */}
              <Route path="*" element={
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
              } />
            </Routes>
            
            <CartModal />
            <ToastContainer 
              position="top-right" 
              autoClose={3000}
              hideProgressBar={false}
              newestOnTop={true}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="light"
              className="toast-container"
              toastClassName="toast-item"
              bodyClassName="toast-body"
              progressClassName="toast-progress"
              limit={3}
            />
            </div>
          </CartProvider>
        </MenuProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;