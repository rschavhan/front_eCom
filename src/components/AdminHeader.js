import React, { useContext } from 'react';
import { NavLink , Link } from 'react-router-dom'; // Import NavLink for active link styling
import { AppContext } from '../context/AppContext'; // Import the context
import '../styles/AdminHeader.css'; // Import the CSS file for styling

const AdminHeader = () => {
  const { logout } = useContext(AppContext); // Get logout from context

  return (
    <header className="admin-header">
      <nav className="nav">
        <div className="logo-container">
          <NavLink to="/admin-dashboard" exact>
            <img src="logo.png" alt="Logo" className="logo" />
          </NavLink>
          <span className="site-name">ShopEzy Admin</span>
        </div>
        <div className="nav-links">
          <NavLink
            to="/admin-dashboard/product-manager"
            activeClassName="active"
            exact
          >
            Product Manager
          </NavLink>
          <NavLink
            to="/admin-dashboard/user-manager"
            activeClassName="active"
            exact
          >
            User Manager
          </NavLink>
          <NavLink
            to="/admin-dashboard/order-manager"
            activeClassName="active"
            exact
          >
            Order Manager
          </NavLink>
          <NavLink
            to="/admin-dashboard/admin-profile"
            activeClassName="active"
            exact
          >
            Admin Profile
          </NavLink>
          <Link to="/" onClick={logout}>Logout</Link>
        </div>
      </nav>
    </header>
  );
};

export default AdminHeader;
