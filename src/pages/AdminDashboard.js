import React from 'react';
import {  Route, Routes } from 'react-router-dom';
import ProductManager from '../components/ProductManager';
import UserManager from '../components/UserManager';
import OrderManager from '../components/OrderManager';
const AdminDashboard = () => {
    return (
      <div>
        <Routes>
          <Route path="product-manager" element={<ProductManager />} />
          <Route path="user-manager" element={<UserManager />} />
          <Route path="order-manager" element={<OrderManager />} />
        </Routes>
      </div>
    );
  };
  
  export default AdminDashboard;
