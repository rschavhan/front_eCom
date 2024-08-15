import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import '../styles/Header.css'; // Import the CSS file for styling
//import { AppProvider, AppContext } from './context/AppContext';

const Header = () => {
  const { userName,userId, logout, cart } = useContext(AppContext);

  return (
    <header className="header">
      <nav className="nav">
        <div className="logo-container">
          <Link to="/">
            <img src="logo.png" alt="Logo" className="logo" />
          </Link>
          <span className="site-name">ShopEzy</span>
        </div>
        <div className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/products">Products</Link>
          {userId ? (
            <>
            <Link to="/cart">Cart ({cart.length})</Link>
            <Link to="/order-summary">My Orders</Link>
              <span className='username'>Welcome, {userName}</span>
              <button onClick={logout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header; // Ensure default export
