import React from "react";
import { Link } from "react-router-dom";
import "../styles/footer.css";

const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className="social-icon-svg">
    <rect
      x="3"
      y="3"
      width="18"
      height="18"
      rx="5"
      ry="5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    />
    <circle
      cx="12"
      cy="12"
      r="4"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    />
    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
  </svg>
);

const TwitterIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className="social-icon-svg">
    <path
      d="M22 5.8c-.7.3-1.5.6-2.3.7.8-.5 1.4-1.3 1.7-2.2-.8.5-1.7.8-2.6 1-1.5-1.6-4.2-1.3-5.3.6-.5.8-.6 1.8-.3 2.7-3.2-.2-6-1.7-7.9-4.1-1.1 1.8-.5 4.1 1.2 5.2-.6 0-1.2-.2-1.8-.5 0 2 1.4 3.8 3.4 4.2-.6.2-1.2.2-1.8.1.5 1.7 2.1 2.9 3.9 3-1.6 1.2-3.5 1.9-5.5 1.9H4c2 1.3 4.3 2 6.7 2 8.1 0 12.8-6.8 12.5-12.9.8-.5 1.5-1.2 2-1.9-.7.3-1.5.5-2.2.6z"
      fill="currentColor"
    />
  </svg>
);

const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className="social-icon-svg">
    <path
      d="M13.5 21v-7h2.4l.4-2.8h-2.8V9.4c0-.8.2-1.4 1.4-1.4h1.5V5.5c-.3 0-1.2-.1-2.3-.1-2.3 0-3.8 1.4-3.8 4v1.8H8v2.8h2.3v7h3.2z"
      fill="currentColor"
    />
  </svg>
);

const Footer: React.FC = () => {
  return (
    <footer className="app-footer">
      <div className="app-footer-container">
        <div className="app-footer-brand">
          <div className="logo-box">S</div>
          <h2>StoreHub | Inventory &amp; Order Management</h2>
        </div>

        <div className="app-footer-center">
          <nav className="app-footer-menu">
            <Link to="/">Contact Us</Link>
            <Link to="/">Privacy Policy</Link>
          </nav>

          <div className="app-footer-social" aria-label="Social links">
            <a href="#" aria-label="Instagram" title="Instagram">
              <InstagramIcon />
            </a>
            <a href="#" aria-label="Twitter" title="Twitter">
              <TwitterIcon />
            </a>
            <a href="#" aria-label="Facebook" title="Facebook">
              <FacebookIcon />
            </a>
          </div>
        </div>

        <p className="app-footer-copy">
          © {new Date().getFullYear()} Store Hub
        </p>
      </div>
    </footer>
  );
};

export default Footer;
