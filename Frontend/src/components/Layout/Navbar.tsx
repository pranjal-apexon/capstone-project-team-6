import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useLocation, Link } from "react-router-dom";
import type { RootState } from "../../store/store";
import { logout } from "../../store/authSlice";
import "../styles/navbar.css";

const Navbar: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated } = useSelector(
    (state: RootState) => state.auth,
  );
  const { items } = useSelector((state: RootState) => state.cart);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand" onClick={() => navigate("/")}>
          <div className="logo-box">S</div>
          <h1>StoreHub | Inventory & Order Management</h1>
        </div>
        <div className="navbar-menu">
          {isAuthenticated ? (
            <>
              <Link
                to="/"
                className={location.pathname === "/" ? "active-link" : ""}
              >
                Home
              </Link>
              <Link
                to="/products"
                className={
                  location.pathname.startsWith("/products") ? "active-link" : ""
                }
              >
                Products
              </Link>
              <Link
                to="/orders"
                className={
                  location.pathname.startsWith("/orders") ? "active-link" : ""
                }
              >
                All Orders
              </Link>
              {user?.isAdmin && (
                <Link
                  to="/admin"
                  className={
                    location.pathname === "/admin" ? "active-link" : ""
                  }
                >
                  Admin
                </Link>
              )}
              <div className="user-info">
                <span>Hi, {user?.fullName || "System"}</span>
              </div>
              <Link to="/cart" className="cart-link">
                🛒 Cart ({items.length})
              </Link>
              <button onClick={handleLogout} className="btn-logout">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/">Home</Link>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
