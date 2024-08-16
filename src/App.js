import React, { useContext } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AppProvider, AppContext } from './context/AppContext';
import { SearchProvider } from './context/SearchContext';
import Header from './components/Header';
import AdminHeader from './components/AdminHeader';
import Footer from './components/Footer';
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import Products from './pages/Products';
import Cart from './components/Cart';
import AdminDashboard from './pages/AdminDashboard';
import Checkout from './pages/Checkout';  // Import the Checkout component
import Billing from './pages/Billing';
import OrderSummary from './pages/OrderSummary';

import UserProfile from './pages/UserProfile'; 
import './App.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import WishlistPage from './pages/WishlistPage';

const AppContent = () => {
  const { userRole } = useContext(AppContext);

  return (
    <div className="App">
      {userRole && userRole.includes('ADMIN') ? <AdminHeader /> : <Header />}
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/products" element={<Products />} />
          <Route path="/wishlist" element={<WishlistPage />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/admin-dashboard/*" element={<AdminDashboard />} />
          <Route path="/checkout" element={<Checkout />} /> 
          <Route path="/billing" element={<Billing />} />
          <Route path="/order-summary" element={<OrderSummary />} />
          <Route path="/profile" element={<UserProfile />} />
        </Routes>
      </main>
      <Footer />
      <ToastContainer />
    </div>
  );
};

const App = () => (
  <Router>
    <AppProvider>
      <SearchProvider>
        <AppContent />
      </SearchProvider>
    </AppProvider>
  </Router>
);

export default App;
