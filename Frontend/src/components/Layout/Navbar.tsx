import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import type { RootState } from '../../store/store';
import { logout } from '../../store/authSlice';
import '../styles/navbar.css';

const Navbar: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const { items } = useSelector((state: RootState) => state.cart);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <h1 onClick={() => navigate('/products')} style={{ cursor: 'pointer' }}>
            StoreHub
          </h1>
        </div>
        <div className="navbar-menu">
          {isAuthenticated ? (
            <>
              <a href="/products">Products</a>
              <a href="/orders">Orders</a>
              {user?.isAdmin && <a href="/admin">Admin</a>}
              <a href="/cart" className="cart-link">
                Cart ({items.length})
              </a>
              <div className="user-info">
                <span>Welcome, {user?.fullName}</span>
              </div>
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
