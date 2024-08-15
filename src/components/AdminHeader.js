import React,{useContext} from 'react';
import { Link } from 'react-router-dom';
import { AppContext } from '../context/AppContext'; // Import the context
import '../styles/AdminHeader.css'; // Import the CSS file for styling

const AdminHeader = () => {


  const { logout } = useContext(AppContext); // Get logout from context
  return (
    <header className="admin-header">
      <nav className="nav">
        <div className="logo-container">
          <Link to="/admin-dashboard">
            <img src="logo.png" alt="Logo" className="logo" />
          </Link>
          <span className="site-name">ShopEzy Admin</span>
        </div>
        <div className="nav-links">
          <Link to="/admin-dashboard/product-manager">Product Manager</Link>
          <Link to="/admin-dashboard/user-manager">User Manager</Link>
          <Link to="/admin-dashboard/order-manager">Order Manager</Link>
          <Link to="/" onClick={logout}>Logout</Link>
        </div>
      </nav>
    </header>
  );
};

export default AdminHeader;
