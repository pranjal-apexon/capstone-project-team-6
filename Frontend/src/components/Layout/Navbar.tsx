import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import type { RootState } from '../../store/store';
import { logout } from '../../store/authSlice';
import '../styles/navbar.css';

const Navbar: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const { items } = useSelector((state: RootState) => state.cart);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand" onClick={() => navigate('/products')}>
          <div className="logo-box">S</div>
          <h1>StoreHub | Inventory & Order Management</h1>
        </div>
        <div className="navbar-menu">
          {isAuthenticated ? (
            <>
              <a href="/products" className={location.pathname === '/products' ? 'active-link' : ''}>
                Products
              </a>
              <a href="/orders" className={location.pathname === '/orders' ? 'active-link' : ''}>
                All Orders
              </a>
              {user?.isAdmin && (
                <a href="/admin" className={location.pathname === '/admin' ? 'active-link' : ''}>
                  Admin
                </a>
              )}
              <div className="user-info">
                <span>Hi, {user?.fullName || 'System'}</span>
              </div>
              <a href="/cart" className="cart-link">
                🛒 Cart ({items.length})
              </a>
              <button onClick={handleLogout} className="btn-logout">
                Logout
              </button>
            </>
          ) : (
            <>
              <a href="/login">Login</a>
              <a href="/register">Register</a>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;