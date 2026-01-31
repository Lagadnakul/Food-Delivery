import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import Home from './Pages/Home';
import Menu from './Pages/Menu';
import Checkout from './Pages/Checkout';
import OrderConfirmation from './Pages/OrderConfirmation';
import RestaurantDetail from './Pages/RestaurantDetail';
import RestaurantsPage from './Pages/RestaurantsPage';
import MobileApp from './Pages/MobileApp';
import Contact from './Pages/Contact';
import { CartProvider } from './contexts/CartContext';
import { MenuProvider } from './contexts/MenuContext';
import CartModal from './components/Cart/CartModal';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <Router>
      <MenuProvider>
        <CartProvider>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/menu" element={<Menu />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/order-confirmation/:orderId" element={<OrderConfirmation />} />
                <Route path="/restaurants" element={<RestaurantsPage />} />
                <Route path="/restaurants/:restaurantId" element={<RestaurantDetail />} />
                <Route path="/mobile-app" element={<MobileApp />} />
                <Route path="/contact" element={<Contact />} />
              </Routes>
            </main>
            <Footer />
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
    </Router>
  );
}

export default App;