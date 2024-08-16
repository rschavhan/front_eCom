import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom'; // Import NavLink for active link styling
import { AppContext } from '../context/AppContext';
import '../styles/Header.css'; // Import the CSS file for styling

const Header = () => {
  const { userName, userId, logout, cart } = useContext(AppContext);

  return (
    <header className="header">
      <nav className="nav">
        <div className="logo-container">
          <NavLink to="/" exact>
            <img src="logo.png" alt="Logo" className="logo" />
          </NavLink>
          <span className="site-name">ShopEzy</span>
        </div>
        <div className="nav-links">
          <NavLink to="/" exact activeClassName="active">
            Home
          </NavLink>
          <NavLink to="/products" activeClassName="active">
            Products
          </NavLink>
          {userId ? (
            <>
              <NavLink to="/wishlist" activeClassName="active">
                Wishlist
              </NavLink>
              <NavLink to="/cart" activeClassName="active">
                Cart ({cart.length})
              </NavLink>
              <NavLink to="/order-summary" activeClassName="active">
                My Orders
              </NavLink>
              <NavLink to="/profile" activeClassName="active">
                Profile
              </NavLink>
              <span className='username' style={{ color: 'red', opacity: '50%' }}>
                Welcome,<br /> {userName}
              </span>
              <button onClick={logout}>Logout</button>
            </>
          ) : (
            <>
              <span className='guest-mode'>Guest mode</span>
              <NavLink to="/login" activeClassName="active">
                Login
              </NavLink>
              <NavLink to="/register" activeClassName="active">
                Register
              </NavLink>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;
