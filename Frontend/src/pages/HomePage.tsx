import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import productApi from "../api/productApi";
import type { Product } from "../types/product.types";
import "../components/styles/home.css";

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await productApi.getAll();
        setProducts(data);
      } catch {
        setError("Unable to load featured products right now.");
      } finally {
        setIsLoading(false);
      }
    };

    loadProducts();
  }, []);

  const featuredProducts = useMemo(() => products.slice(0, 6), [products]);

  const getProductEmoji = (name: string, category: string) => {
    const title = name.toLowerCase();

    if (title.includes("keyboard")) return "⌨️";
    if (title.includes("mouse")) return "🖱️";
    if (title.includes("lamp")) return "💡";
    if (title.includes("hub") || title.includes("usb")) return "🔌";

    switch (category.toLowerCase()) {
      case "electronics":
        return "💻";
      case "clothing":
        return "👕";
      case "home":
        return "🏠";
      default:
        return "📦";
    }
  };

  return (
    <div className="home-page">
      <section className="home-hero">
        <div className="home-hero-content">
          <p className="home-eyebrow">STORE HUB</p>
          <h1>Welcome to Store Hub</h1>
          <p className="home-hero-subtitle">
            Discover quality products, manage orders effortlessly, and shop with
            confidence from one clean and reliable platform.
          </p>
          <button
            className="home-shop-btn"
            onClick={() => navigate("/products")}
          >
            Shop Now
          </button>
        </div>
        <div className="home-hero-art" aria-hidden="true">
          <div className="orb orb-a" />
          <div className="orb orb-b" />
          <div className="orb orb-c" />
        </div>
      </section>

      <section className="home-section">
        <div className="home-section-head">
          <h2>Featured Products</h2>
          <Link to="/products" className="home-link">
            View all products
          </Link>
        </div>

        {isLoading && (
          <div className="loading">Loading featured products...</div>
        )}
        {error && <div className="error-banner">{error}</div>}

        {!isLoading && !error && (
          <div className="featured-grid">
            {featuredProducts.map((product) => (
              <article key={product.id} className="featured-card">
                <div className="featured-card-image" aria-hidden="true">
                  <span>{getProductEmoji(product.name, product.category)}</span>
                </div>
                <div className="featured-card-body">
                  <h3>{product.name}</h3>
                  <p className="featured-price">${product.price.toFixed(2)}</p>
                  <button
                    className="featured-action-btn"
                    onClick={() => navigate(`/products/${product.id}`)}
                  >
                    View Product
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="home-section">
        <h2>Why Choose Us</h2>
        <div className="why-grid">
          <article className="why-card">
            <h3>Fast Delivery</h3>
            <p>
              We process and dispatch orders quickly so your items arrive on
              time.
            </p>
          </article>
          <article className="why-card">
            <h3>Secure Payments</h3>
            <p>
              Transactions are protected with trusted payment and security
              practices.
            </p>
          </article>
          <article className="why-card">
            <h3>Quality Products</h3>
            <p>
              We focus on reliable products curated for everyday use and
              long-term value.
            </p>
          </article>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
